import PanelBase from './panel-base.js';

/**
 * 垂直または水平方向への整列やタブ切り替えによるパネルのスイッチ(3個のうちいずれか1つ)を提供します。
 */
export default class StackContainer extends PanelBase
{
    /**
     * @type { StackContainerOptions }
     */
    static DEFAULT_OPTIONS = {
        type: 'stack',
        direction: 'vertical',
        reproportionable: true,
        dockable: true,
        separatorWidth: 2,
        additionalClassName: '',
        attributes: [],
        template: undefined,
        panelAddArea: undefined,
        adjustSize: true,
    };

    /**
     * UIを格納するパネルエリア。ウィンドウ・ペイン表示が可能
     *
     * @param { StackContainerOptions }      opts    オプション
     * @param { (StackContainer | Panel)[] } children 内容コンテンツ
     */
    constructor (opts = StackContainer.DEFAULT_OPTIONS, ...children) {
        super(PanelBase.document.createElement('div'), Object.assign(opts, StackContainer.DEFAULT_OPTIONS, {...opts}), ['magica-panel-stack-wrapper'], ['magica-panel-stack-inner'], ...children);

        if (this.opts.adjustSize === false) {
            this.opts.reproportionable = false;
        }

        this._calcGridSize(undefined, undefined, this.opts.template);
        if (this.opts.direction === 'vertical') {
            this.element.classList.add('vertical');
        }

        if (this.opts.direction === 'horizontal') {
            this.element.classList.add('horizontal');
        }

        if (typeof this.opts.direction === 'object') {
            this.element.classList.add('tab');
        }
        else {
            if (!this.addareas) {
                this.addareas = [];
                this.element.classList.add('empty');
            }

            const addArea = PanelBase.document.createElement('div');
            addArea.classList.add('magica-panel-stack-separator', 'empty');
            if (typeof this.opts.panelAddArea === 'object') {
                addArea.append(this.opts.panelAddArea);
            }
            else {
                addArea.textContent = this.opts.panelAddArea ?? this.opts.direction === 'vertical'? '▤' : '▥';
            }

            this.addareas.push(addArea);
            this.element.append(addArea);
        }

        this._movehandler = evt => {
            if (evt.detail.target.opts.modal !== 'modaless') return;

            const mouseY = this.root.element.scrollTop + (evt.detail.ev.pageY ?? evt.detail.ev.touches[0].pageY);
            const mouseX = this.root.element.scrollLeft + (evt.detail.ev.pageX ?? evt.detail.ev.touches[0].pageX);
            const elemRect = this.element.getClientRects()[0];
            if (elemRect.top < mouseY && mouseY < elemRect.bottom
            && elemRect.left < mouseX && mouseX < elemRect.right
            && evt.detail.target.opts.maximum.enable === true && this.opts.dockable === true) {
                this.element.classList.add('hover');
            }
            else {
                this.element.classList.remove('hover');
            }

            for (const addarea of this.addareas) {
                const rect = addarea.getClientRects()[0];
                if (rect && rect.top < mouseY && mouseY < rect.bottom
                && rect.left < mouseX && mouseX < rect.right) {
                    addarea.classList.add('hover');
                }
                else {
                    addarea.classList.remove('hover');
                }
            }
        };

        this._movedhandler = evt => {
            if (evt.detail.target.opts.modal !== 'modaless') return;

            const mouseY = this.root.element.scrollTop + (evt.detail.ev.pageY ?? evt.detail.ev.touches[0].pageY);
            const mouseX = this.root.element.scrollLeft + (evt.detail.ev.pageX ?? evt.detail.ev.touches[0].pageX);
            const elemRect = this.element.getClientRects()[0];
            if (elemRect.top < mouseY && mouseY < elemRect.bottom
            && elemRect.left < mouseX && mouseX < elemRect.right
            && evt.detail.target.opts.maximum.enable === true && this.opts.dockable === true) {
                for (const addarea of this.addareas) {
                    if (evt.detail.target.element.previousElementSibling === addarea.parentElement
                    || evt.detail.target.element.nextElementSibling === addarea.parentElement
                    || evt.detail.target.parent !== this.root) {
                        addarea.classList.remove('hover');
                        continue;
                    }

                    const rect = addarea.getClientRects()[0];
                    if (rect && rect.top < mouseY && mouseY < rect.bottom
                    && rect.left < mouseX && mouseX < rect.right) {
                        this._lastref = this.element.contains(addarea.closest('.magica-panel-stack-inner'))? addarea.parentElement: undefined;
                        this._lastTargetRange = evt.detail.target.element.getClientRects()[0][this.opts.direction === 'vertical'? 'height': 'width'];
                        evt.detail.target.parent = this;
                    }

                    addarea.classList.remove('hover');
                }

                this.element.classList.remove('hover');
            }
        };
    }

    get parent () {
        return super.parent;
    }

    set parent (val) {
        super.parent = val;
    }

    changeParentHandler (evt) {
        super.changeParentHandler(evt);
        if (this.root) {
            if (this._root) {
                this._root.removeEventListener('childrenmove', this._movehandler);
                this._root.removeEventListener('childrenmoved', this._movedhandler);
            }

            this.root.addEventListener('childrenmove', this._movehandler);
            this.root.addEventListener('childrenmoved', this._movedhandler);
            this._root = this.root;
            this._calcGridSize();
        }
    }

    append (val) {
        if (!this.addareas) this.addareas = [];
        if (this.inner.children.length === 0) {
            const sep = this._generateSeparator();
            this.addareas.push(sep.children[0]);
            this.inner.append(sep);
        }

        let ranges = [];
        if (this.element.closest('body')) {
            const windowRange = this._lastTargetRange;
            ranges = this.children.map(e => e.element.getClientRects()?.[0]?.[this.opts.direction === 'vertical'? 'height': 'width'] ?? e.opts?.defaultSize[this.opts.direction === 'vertical'? 'y': 'x'] ?? 100);

            if (this._lastref) {
                const idx = this.children.map(e => e.element).indexOf(this._lastref.previousElementSibling);
                const insertTargetRange = ((ranges[idx] ?? 0) + (ranges[idx + 1] ?? 0)) / 2;
                const insertRange = Math.min(insertTargetRange, windowRange) - this.opts.separatorWidth;
                if (~idx && ranges[idx + 1]) {
                    const [smallIdx, largeIdx] = ranges[idx] > ranges[idx + 1]? [idx + 1, idx]: [idx, idx + 1];
                    const ratio = ranges[smallIdx] / ranges[largeIdx];
                    const smallSize = Math.round(insertRange / 2 * ratio);
                    ranges[smallIdx] -= smallSize;
                    ranges[largeIdx] -= (insertRange - smallSize);
                }
                else if (~idx) {
                    ranges[idx] -= insertRange;
                }
                else {
                    ranges[idx + 1] -= insertRange;
                }

                ranges.splice(idx + 1, 0, insertRange - this.opts.separatorWidth);
            }

            ranges = ranges.map(e => `${e}px`);
        }

        super.append(val, this._lastref);
        if (val.maximum) val.maximum();

        const sep = this._generateSeparator();
        this.addareas.push(sep.children[0]);
        if (val.element.nextElementSibling) {
            this.inner.insertBefore(sep, val.element.nextElementSibling);
        }
        else {
            this.inner.append(sep);
        }

        this.element.classList.remove('empty');
        if (this.element.closest('body') && this.opts.adjustSize) {
            this._calcGridSize(undefined, undefined, ranges.length === 0? undefined: ranges);
        }
    }

    resizeParentHandler () {
        if (!this.element.closest('body')) return;
        if (this.parent.opts.type === 'base' || this.parent.fixedsize) this.fixedsize = true;

        let ranges = this.children.map(e => e.element.getClientRects()?.[0]?.[this.opts.direction === 'vertical'? 'height': 'width']).filter(e => e !== undefined);
        const total = ranges.reduce((a, c) => a + c, 0);
        const ratios = ranges.map(e => e / total);
        const currentWidth = this.inner.getClientRects()[0][this.opts.direction === 'vertical'? 'height': 'width'] - (this.opts.separatorWidth * (this.children.length + 1));
        ranges = ratios.map(e => Math.round(e * currentWidth));
        ranges.pop();
        ranges.push(currentWidth - ranges.reduce((a, c) => a + c, 0));
        ranges = ranges.map(e => `${e}px`);
        if (ranges.length > 0 && this.opts.adjustSize) {
            this._calcGridSize(undefined, undefined, ranges);
        }

        this.dispatchEvent(new PanelBase.CustomEvent('resize', {detail: {target: this}}));
    }

    remove (val) {
        let ranges = typeof this._lastTargetRange === 'object'? this._lastTargetRange: this.children.map(e => e.element.getClientRects()?.[0]?.[this.opts.direction === 'vertical'? 'height': 'width']);
        if (ranges) {
            this._lastTargetRange = undefined;
            const idx = this.children.indexOf(val);
            if (!ranges[idx - 1] && ranges[idx + 1]) {
                ranges[idx + 1] += ranges[idx] + this.opts.separatorWidth;
            }
            else if (!ranges[idx + 1] && ranges[idx - 1]) {
                ranges[idx - 1] += ranges[idx] + this.opts.separatorWidth;
            }
            else if (ranges[idx + 1] && ranges[idx - 1]) {
                const [smallIdx, largeIdx] = ranges[idx - 1] > ranges[idx + 1]? [idx + 1, idx - 1]: [idx - 1, idx + 1];
                const ratio = ranges[smallIdx] / ranges[largeIdx];
                const smallSize = Math.round((ranges[idx] + this.opts.separatorWidth) / 2 * ratio);
                ranges[smallIdx] += smallSize;
                ranges[largeIdx] += (ranges[idx] + this.opts.separatorWidth) - smallSize;
            }

            ranges = ranges.filter((_e, i) => i !== idx).map(e => `${e}px`);
        }

        val.element.nextElementSibling.remove();

        super.remove(val);
        if (this.inner.children.length === 1) {
            this.addareas.filter(e => e !== this.inner.children[0].children[0]);
            this.inner.children[0].remove();
            this.element.classList.add('empty');
        }

        if (this.opts.adjustSize) {
            this._calcGridSize(undefined, undefined, ranges?.length === 0? undefined: ranges);
        }
    }

    _calcGridSize (sep, pos, template) {
        if (!this.parent?.fixedsize && this.parent?.opts?.type !== 'base') return;
        if ((!this.opts.template || this.opts.template?.length === this.children.length) && !this._gridInit) template = this.opts.template;

        this._gridInit = true;

        const target = this.opts.direction === 'vertical'? 'gridTemplateRows': 'gridTemplateColumns';
        const currentSizes = template ?? this.inner.style[target].split(' ').filter(e => e !== '').filter((_e, i) => i % 2 !== 0);
        if (this.children.length === 0) {
            this.inner.style[target] = '';
            return;
        }

        if (this.children.length === 1) {
            currentSizes[0] = '1fr';
        }

        if (sep && sep.previousElementSibling && sep.nextElementSibling && pos !== undefined) {
            const bros = Array.from(this.inner.children).filter(e => !e.classList.contains('magica-panel-stack-separator'));
            const prevIdx = bros.indexOf(sep.previousElementSibling);
            const nextIdx = bros.indexOf(sep.nextElementSibling);
            const prevRect = sep.previousElementSibling.getClientRects()[0];
            const nextRect = sep.nextElementSibling.getClientRects()[0];

            let prevRange = pos - (this.opts.direction === 'vertical'? prevRect.top: prevRect.left - this.opts.separatorWidth);
            let frFlag = false;
            if (prevRange <= 0 && this.children[prevIdx].opts.minimable) {
                frFlag = true;
                currentSizes[prevIdx] = '0px';
                currentSizes[nextIdx] = `${nextRect[this.opts.direction === 'vertical'? 'bottom': 'right'] - prevRect[this.opts.direction === 'vertical'? 'top': 'left'] - this.opts.separatorWidth}px`;
            }
            else {
                prevRange = this.children[prevIdx].opts.minSize[this.opts.direction === 'vertical'? 'y': 'x'] > prevRange ? this.children[prevIdx].opts.minSize[this.opts.direction === 'vertical'? 'y': 'x'] : prevRange;
            }

            let nextRange = (this.opts.direction === 'vertical'? nextRect.bottom: nextRect.right) - ((this.opts.direction === 'vertical'? prevRect.top: prevRect.left) + prevRange + this.opts.separatorWidth) - this.opts.separatorWidth;
            if (nextRange <= 0 && this.children[nextIdx].opts.minimable && !frFlag) {
                frFlag = true;
                currentSizes[prevIdx] = `${nextRect[this.opts.direction === 'vertical'? 'bottom': 'right'] - prevRect[this.opts.direction === 'vertical'? 'top': 'left'] - this.opts.separatorWidth}px`;
                currentSizes[nextIdx] = '0px';
            }
            else {
                nextRange = this.children[nextIdx].opts.minSize[this.opts.direction === 'vertical'? 'y': 'x'] > nextRange ? this.children[nextIdx].opts.minSize[this.opts.direction === 'vertical'? 'y': 'x'] : nextRange;
                prevRange = nextRect[this.opts.direction === 'vertical'? 'bottom': 'right'] - prevRect[this.opts.direction === 'vertical'? 'top': 'left'] - nextRange - this.opts.separatorWidth;
            }

            if (!frFlag) {
                if (this.opts.direction === 'vertical') {
                    currentSizes[prevIdx] = `${prevRange}px`;
                    currentSizes[nextIdx] = `${nextRange}px`;
                }
                else if (this.opts.direction === 'horizontal') {
                    currentSizes[prevIdx] = `${prevRange}px`;
                    currentSizes[nextIdx] = `${nextRange}px`;
                }
            }
        }

        for (let idx = 0; idx < this.children.length; idx++) if (currentSizes[idx] === undefined) {
            currentSizes.push('1fr');
        }

        currentSizes.splice(this.children.length);
        this.inner.style[target] = `${this.opts.separatorWidth}px ${currentSizes.join(` ${this.opts.separatorWidth}px `)} ${this.opts.separatorWidth}px`;
        this.fixedsize = true;
        this.dispatchEvent(new PanelBase.CustomEvent('resize', {detail: {target: this}}));
    }

    _generateSeparator () {
        const elem = PanelBase.document.createElement('div');
        elem.classList.add('magica-panel-stack-separator');
        if (this.opts.reproportionable === false) {
            elem.classList.add('disable');
        }

        elem.style[this.opts.direction === 'vertical'? 'height': 'width'] = `${this.opts.separatorWidth}px`;
        elem.draggable = true;
        const inner = PanelBase.document.createElement('div');
        inner.classList.add('magica-panel-stack-separator-droparea');
        elem.append(inner);
        elem.addEventListener('dragstart', ev => {
            ev.dataTransfer.setDragImage(new Image(), 0, 0);
        });

        elem.addEventListener('drag', ev => {
            if (ev.screenY === 0 || this.opts.reproportionable === false) return;

            this._calcGridSize(ev.target, this.opts.direction === 'vertical'? ev.pageY : ev.pageX);
        });

        elem.addEventListener('touchmove', ev => {
            if (ev.touches[0]?.screenY === 0 || this.opts.reproportionable === false) return;

            this._calcGridSize(ev.target, this.opts.direction === 'vertical'? ev.touches[0].pageY : ev.touches[0].pageX);
        });

        return elem;
    }

    /**
     * 子要素の移動に追従します。
     */
    childMoveHandler (evt) {
        this._lastTargetRange = this.children.map(e => e.element.getClientRects()[0][this.opts.direction === 'vertical'? 'height': 'width']);
        evt.detail.target.normal((evt.detail.ev.pageX ?? evt.detail.ev.touches[0].pageX));
        evt.detail.target.parent = this.root;
    }

    get root () {
        let parent = this._parent;
        while (parent?.parent !== undefined) {
            parent = parent.parent;
        }

        return parent;
    }
}
