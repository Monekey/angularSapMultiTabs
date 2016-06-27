/**
 * Created by Administrator on 2016/6/27 0027.
 */
var fs = require('fs');
// toggle-html-js-code $FilePath$ $SelectionStartLine$ $SelectionEndLine$
var filePath = process.argv[2],
    startLine = +process.argv[3],
    endLine = +process.argv[4],
    type = 'html',
    content,
    lines,
    i;
content = fs.readFileSync(filePath).toString();
lines = content.split('\n');
if (/'.*',?/.test(lines[startLine - 1])) {
    type = 'js';
}
for (i = startLine - 1; i < endLine; i++) {
    lines[i] = type === 'html' ?
        html2js(lines[i], i !== startLine - 1 && i === endLine - 1) :
        js2html(lines[i], i !== startLine - 1 && i === endLine - 1);
}
fs.writeFileSync(filePath, lines.join('\n'));
// tools
function html2js(str, lastLine) {
    if (!/([\S^'].*[\S^'])/.test(str)) {
        return str;
    }
    return str.replace(/([\S^'].*[\S^'])/, '\'\$1\'' + (lastLine ? '' : ','));
}
function js2html(str, lastLine) {
    if (lastLine) {
        if (!/'(.*)'/.test(str)) {
            return str;
        }
        return str.replace(/'(.*)'/, '\$1');
    } else {
        if (!/'(.*)',/.test(str)) {
            return str;
        }
        return str.replace(/'(.*)',/, '\$1');
    }
}