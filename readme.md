![MagicaPanel](attachment/logo.png)
===

MagicaPanel は MDI ( Multiple Document Interface ) ライクに HTML を複数の ウィンドウ領域に分割して表示できるUIライブラリです。

![サンプル](attachment/sample.gif)

使用方法
---

MagicaPanelをインストールするコマンドを以下に記...
そうと思いましたが、`npm`に`publish`したら書きます。

### ライブラリ利用方法 ###

MagicaPanelが提供する各クラスは以下のコンストラクタ引数を取ります。

1. 自身を表示する`HTMLElement`(`BaseContainer` のみ)
2. オプション
3. (以降) 自身の中に表示する子要素

また、各ウィンドウやその整列は一番上の親に`BaseContainer`クラスのインスタンスが配置される構造にならなければなりません。

以下サンプル

```javascript
    // 一番親は`BaseContainer`である必要があります。
    new MagicaPanel.BaseContainer(
        document.body,
        {overflowX: 'hidden', overflowY: 'hidden'},
        // `StackContainer`には子アイテムを整列表示することが出来ます。
        new MagicaPanel.StackContainer(
            undefined, // オプションを与えなかった場合、各クラスの既定が採用されます。
            // `Panel`は`StackContainer`の子要素として整列表示されます。
            // `Panel`が唯一純粋なHTMLElementを子要素に持つことが出来ます。
            //     (`StackContainer`を持つことも出来ます。)
            new MagicaPanel.Panel(
                {title: 'stack-sample!'},
                document.createElement('div')
            ),
            new MagicaPanel.Panel(
                {title: 'stack-sample!'},
                document.createElement('div')
            )
        ),
        // `Panel`は`StackContainer`に含まれないため、ウィンドウとしてフロー表示されます。
        new MagicaPanel.Panel(
            {title: 'window-sample!'},
            document.createElement('div')
        )
    );
```

ドキュメント
---
準備中です。
