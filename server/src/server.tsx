import express, {Request, Response} from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {ServerStyleSheets} from '@material-ui/core/styles';
import {MainSSR} from '../../src/App';
import * as fs from "fs";
import * as path from "path";
import {JSDOM} from "jsdom";

export const app = express();

const mainHtml = fs.readFileSync(path.resolve(__dirname, "../../../build/index.html"))
    .toString();

const renderFullPage = (html: string, css: string) => {
    const mainDom = new JSDOM(mainHtml);
    const root = mainDom.window.document.getElementById("root")!!;

    const body = mainDom.window.document.createElement('div');
    body.innerHTML = html;
    for (const child of body.childNodes)
        root.append(child);

    const style = mainDom.window.document.createElement("style");
    style.id = "jss-server-side";
    style.innerHTML = css;

    // const scripts = mainDom.window.document.getElementsByTagName("script");
    // for (const script of scripts) {
    //     script.parentNode!!.removeChild(script);
    // }

    mainDom.window.document.getElementsByTagName("head")[0].insertAdjacentElement("beforeend", style);
    return mainDom.serialize();
}

const handleRender = (req: Request, res: Response) => {
    const sheets = new ServerStyleSheets();

    // Render the component to a string.
    const html = ReactDOMServer.renderToString(
        sheets.collect(
            <MainSSR/>,
        ),
    );

    // Grab the CSS from the sheets.
    const css = sheets.toString();

    // Send the rendered page back to the client.
    res.send(renderFullPage(html, css));
}

app.get('/', handleRender);
app.use(express.static('build'));
