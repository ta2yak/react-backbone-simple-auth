// RequireJSの設定
requirejs.config({
    baseUrl : '/js',  // モジュール読み込みのbaseUrlを指定する

    paths : {
        jquery : [
            '/bower_components/jquery/dist/jquery.min'
        ],

        underscore : [
            '/bower_components/underscore/underscore'
        ],

        backbone : [
            '/bower_components/backbone/backbone'
        ],

        react : [
            '/bower_components/react/react'
        ],

        jsx: [
            '/bower_components/require-jsx/jsx'
        ],

        JSXTransformer: [
            '/bower_components/react/JSXTransformer'
        ],

        bootstrap:[
            '/bower_components/bootstrap/dist/js/bootstrap.min'
        ],

    },

    shim : {
        underscore : {
            exports : '_'
        },
        JSXTransformer: {
            exports: "JSXTransformer"
        }
    }
});

require(["jsx!client"]);
