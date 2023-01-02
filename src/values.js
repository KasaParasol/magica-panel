const style = `
.magica-panel-wrapper {
    overflow-x: hidden;
    overflow-y: hidden;
}

.magica-panel-wrapper.ox-s {
    overflow-x: auto;
}

.magica-panel-wrapper.oy-s {
    overflow-y: auto;
}

.magica-panel-base {
    position: relative;
    min-width: 100%;
    min-height: 100%;
    width: 100%;
    height: 100%;
}

.magica-panel-window {
    position: absolute;
    top: 0;
    left: 0;
    padding: 4px;
    background: midnightblue;
    box-sizing: border-box;
}

.magica-panel-titlebar {
    position: relative;
    height: 1.5rem;
    color: white;
    user-select:none;
}

.magica-panel-inner {
    position: relative;
    background: white;
    padding: 1px;
    overflow-x: hidden;
    overflow-y: hidden;
}

.magica-panel-inner.ox-s {
    overflow-x: auto;
}

.magica-panel-inner.oy-s {
    overflow-y: auto;
}

.magica-panel-edge {
    position: absolute;
    user-select:none;
}

.magica-panel-edge.left {
    top: 0;
    left: 0;
    height: 100%;
    width: 4px;
    cursor: ew-resize;
}

.magica-panel-edge.right {
    top: 0;
    right: 0;
    height: 100%;
    width: 4px;
    cursor: ew-resize;
}

.magica-panel-edge.left:active,
.magica-panel-edge.right:active {
    cursor: ew-resize;
}

.magica-panel-edge.top {
    top: 0;
    left: 0;
    height: 4px;
    width: 100%;
    cursor: ns-resize;
}

.magica-panel-edge.bottom {
    bottom: 0;
    left: 0;
    height: 4px;
    width: 100%;
    cursor: ns-resize;
}

.magica-panel-edge.top:active,
.magica-panel-edge.bottom:active {
    cursor: ns-resize;
}

.magica-panel-edge.top.left,
.magica-panel-edge.top.right,
.magica-panel-edge.bottom.left,
.magica-panel-edge.bottom.right {
    height: 4px;
    width: 4px;
    top: unset;
    left: unset;
    right: unset;
    bottom: unset;
}

.magica-panel-edge.top.left {
    top: 0;
    left: 0;
    cursol: nwse-resize;
}

.magica-panel-edge.top.right {
    top: 0;
    right: 0;
    cursol: nesw-resize;
}

.magica-panel-edge.bottom.left {
    bottom: 0;
    left: 0;
    cursol: nesw-resize;
}

.magica-panel-edge.bottom.right {
    bottom: 0;
    right: 0;
    cursol: nwse-resize;
}

.magica-panel-window.maximum {
    padding: 0px;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
}

.magica-panel-window.maximum .magica-panel-edge {
    display: none;
}

.magica-panel-window.maximum .magica-panel-titlebar {
    height: calc(1.5rem + 4px);
}

.magica-panel-window.maximum .magica-panel-inner {
    width: calc(100% - 2px) !important;
    height: calc(100% - 1.5rem - 6px) !important;
}

.magica-panel-button-area {
    position: absolute;
    top: 0;
    right: 0;
    height: calc(1.5rem + 4px);
    user-select:none;
}

.magica-panel-button {
    color: white;
    height: calc(1.5rem + 4px);
    border: none;
    font-weight: bold;
    width: 2.5rem;
    font-size: 1rem;
    background: midnightblue;
}

.magica-panel-button.close {
    background: #701919;
}
.magica-panel-button.close.onactive {
    background: #e63232;
}

.magica-panel-stack-wrapper {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
    position: relative;
}

.magica-panel-stack-wrapper.ox-s {
    overflow-x: auto;
}

.magica-panel-stack-wrapper.oy-s {
    overflow-y: auto;
}

.magica-panel-stack-inner {
    width: 100%;
    height: 100%;
    display: grid;
}

.magica-panel-stack-add {
    background-color: midnightblue;
    color: white;
    border-left: solid 2px midnightblue;
}

.magica-panel-stack-add {
    background-color: midnightblue;
    color: white;
    z-index: 100;
    position: relative;
}

.magica-panel-stack-wrapper.horizontal > .magica-panel-stack-inner > .magica-panel-stack-add {
    background: midnightblue;
}

.magica-panel-stack-wrapper.vertical > .magica-panel-stack-inner > .magica-panel-stack-add {
    background: midnightblue;
}

.magica-panel-stack-add.empty {
    position: absolute;
    margin: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 3rem;
    border-left: none;
    border-top: none;
    width: 5rem;
    text-align: center;
    opacity: 0.5;
    user-select: none;
    display: none;
}

.magica-panel-stack-add-droparea {
    position: absolute;
    display: none;
    background: rgba(25,25,112, 0.3);
}

.magica-panel-stack-wrapper.horizontal > .magica-panel-stack-inner > .magica-panel-stack-add .magica-panel-stack-add-droparea {
    height: 100%;
    width: 10rem;
}

.magica-panel-stack-wrapper.horizontal > .magica-panel-stack-inner > .magica-panel-stack-add .magica-panel-stack-add-droparea {
    left: -5rem;
}

.magica-panel-stack-wrapper.horizontal > .magica-panel-stack-inner > .magica-panel-stack-add:first-of-type .magica-panel-stack-add-droparea {
    left: 0;
}

.magica-panel-stack-wrapper.horizontal > .magica-panel-stack-inner > .magica-panel-stack-add:last-of-type .magica-panel-stack-add-droparea {
    right: 0;
    left: unset;
}

.magica-panel-stack-wrapper.vertical > .magica-panel-stack-inner > .magica-panel-stack-add .magica-panel-stack-add-droparea {
    width: 100%;
    height: 10rem;
}

.magica-panel-stack-wrapper.vertical > .magica-panel-stack-inner > .magica-panel-stack-add .magica-panel-stack-add-droparea {
    top: -5rem;
}

.magica-panel-stack-wrapper.vertical > .magica-panel-stack-inner > .magica-panel-stack-add:first-of-type .magica-panel-stack-add-droparea {
    top: 0;
}

.magica-panel-stack-wrapper.vertical > .magica-panel-stack-inner > .magica-panel-stack-add:last-of-type .magica-panel-stack-add-droparea {
    bottom: 0;
    top: unset;
}

.magica-panel-stack-wrapper.vertical > .magica-panel-stack-inner > .magica-panel-stack-add:NOT(.hover):NOT(:first-of-type):NOT(:last-of-type):hover {
    cursor: ns-resize;
}

.magica-panel-stack-wrapper.horizontal > .magica-panel-stack-inner > .magica-panel-stack-add:NOT(.hover):NOT(:first-of-type):NOT(:last-of-type):hover {
    cursor: ew-resize;
}

.magica-panel-stack-wrapper.hover .magica-panel-stack-add:NOT(.empty) {
    display: block;
}

.magica-panel-stack-wrapper.hover.empty .magica-panel-stack-add.empty {
    display: block;
}

.magica-panel-stack-wrapper.hover .magica-panel-stack-add-droparea {
    display: block;
}

.magica-panel-stack-add.hover {
    opacity: 1;
}

.magica-panel-stack-wrapper.vertical .magica-panel-stack-inner {
    grid-template-columns: 1fr;
}

.magica-panel-stack-wrapper.horizontal .magica-panel-stack-inner {
    grid-template-rows: 1fr;
}

.magica-panel-stack-inner .magica-panel-window.maximum {
    position: relative;
    top: unset !important;
    left unset !important;
    z-index: unset !important;
}

.magica-panel-stack-inner .magica-panel-button.maximum {
    display: none;
}

`;

const Value = {
    style
};

Object.freeze(Value);

export default Value;