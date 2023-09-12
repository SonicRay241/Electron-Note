import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import katex from 'katex'

const md = new MarkdownIt();

const renderMd = (markdown: string, customParser: boolean = true) => {
	let result = ''
    let anchors = ''
	if (!customParser) {
		result = md.render(markdown)
		return result
	}
    let ree = markdown.replaceAll('\n', '\n[//s.#]\n');
    ree = ree.replaceAll('---', '\n[//l.#]\n');
	// console.log(ree);
	result = md.render(ree);
	result = result.replaceAll(
		'[//l.#]',
		'<hr>',
	);
	let whiteSpaces = result.matchAll(/[\S]+?\[\/\/s\.#\]/g)
	for (let whiteSpace of whiteSpaces) {
		if (whiteSpace.toString() == '[//s.#][//s.#]') {	
			result.replace(whiteSpace.toString(), '<br><br>')
		} else {
			result.replace(whiteSpace.toString(), whiteSpace.toString().slice(0, -7))
		}
	}
	result = result.replaceAll(
		'[//s.#]',
		'<br>',
	);

	// const tags = result.matchAll(/#\[\S+\]{(rgb\([0-9]{3}, ?[0-9]{3}, ?[0-9]{3}\)|#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}))}/g)
	// for (let tag of tags) {
	// 	console.log(tag[0].toString());
		
	// 	const color = tag[0].toString().match(/{(rgb\([0-9]{3}, ?[0-9]{3}, ?[0-9]{3}\)|#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}))}/g)?.slice(1).slice(0, -1)
	// 	const value = tag[0].toString().match(/\[\S+\]/g)?.slice(1).slice(0, -1)
	// 	let html = `<div style="background: rgba(0,0,0,0.5);background-color:${color};color:white;"><span>${value}</span></div>`
	// 	result = result.replace(tag[0].toString(), html)
	// }
	
	const codeRe = new RegExp(/<code>[\s\S]*?<\/code>/g);
	const codes = result.matchAll(codeRe);
	for (let code of codes) {
		let innerCode = code.toString().slice(6).slice(0, -7);
		innerCode = innerCode.replaceAll('&quot;', '"');
		innerCode = innerCode.replaceAll('&lt;', '<');
		innerCode = innerCode.replaceAll('&gt;', '>');
		innerCode = innerCode.replaceAll('&amp;', '&');
		innerCode = innerCode.replaceAll(
			'<br>',
			'',
		);
		let outputCode = hljs.highlightAuto(innerCode).value.toString();
		outputCode = outputCode.slice(1)
        outputCode = `<code>${outputCode}</code>`
		outputCode = outputCode.replaceAll('\n\n', '<br>')
		outputCode = outputCode.replaceAll('\n', '<br>')
		// outputCode = outputCode.replace('<br>', '')
		outputCode = outputCode.replaceAll('<br><br>', '<br>')
		result = result.replace(code.toString(), outputCode);
	}
	const codeRe2 = new RegExp(/<code class="language-[\S]+?">[\s\S]*?<\/code>/g)
	const codes2 = result.matchAll(codeRe2)
	for (let code of codes2) {
		let innerCode = code.toString().replace(/<code class="language-[\S]+?">/g, '').slice(0, -7);
		innerCode = innerCode.replaceAll('&quot;', '"');
		innerCode = innerCode.replaceAll('&lt;', '<');
		innerCode = innerCode.replaceAll('&gt;', '>');
		innerCode = innerCode.replaceAll('&amp;', '&');
		innerCode = innerCode.replaceAll(
			'<br>',
			'',
		);
		let language = code.toString().match(/<code class="language-[\S]+?">/g)?.toString().split('-')[1].slice(0,-2) ?? ""  
		let outputCode = ""
		try {
			outputCode = hljs.highlight(innerCode, {language}).value.toString();
		} catch (error) {
			console.log(error);
			outputCode = hljs.highlightAuto(innerCode).value.toString();
		}
		outputCode = outputCode.slice(1)
        outputCode = `<code>${outputCode}</code>`
		outputCode = outputCode.replaceAll('\n\n', '<br>')
		outputCode = outputCode.replaceAll('\n', '<br>')
		// outputCode = outputCode.replace('<br>', '')
		// outputCode = outputCode.replaceAll('<br><br>', '<br>')
		let outputResult = outputCode + `<button onclick="()=>{navigator.clipboard.writeText(${innerCode})}">Copy</button>`
		result = result.replace(code.toString(), outputCode);
	}
	const reId = result.matchAll(new RegExp(/<h[1-6]>[\s\S]*?{#\s?[\S]+?}<\/h[1-6]>/g));
	for (let header of reId) {
		let innerHead = header.toString().slice(4).slice(0, -5);
		const idTag = innerHead
			.match(new RegExp(/\{#\s?[\S]+?}/g))
			?.toString()
			.slice(2)
			.slice(0, -1)
			.trim();
		const headerContent = innerHead.replace(new RegExp(/\{#\s?[\S]+?}/g), '');
		const headerLvl = header.toString()[2];
		const output = `<h${headerLvl} id="${idTag}">${headerContent}</h${headerLvl}>`;
		result = result.replace(header.toString(), output);
		// searchHeaders.push(idTag?.toString() ?? "")
	}
	result = result.replaceAll('<pre>', "<pre class='hljs'>");
	result = result.replaceAll(new RegExp(/<h[4-6]>/g), '<h3>');
	const aTags = result.matchAll(new RegExp(/<a href=".*?">/g));
	for (let anchor of aTags) {
		let b = '';
		b += anchor.toString().slice(0, -1);
		b += ' target="_blank">';
		anchors += b;
		result = result.replace(anchor.toString(), b);
	}
	const superScripts = result.matchAll(/\^[0-9]+?\^/g);
	for (let sup of superScripts) {
		let out = `<sup>${sup.toString().slice(1).slice(0, -1)}</sup>`;
		result = result.replace(sup.toString(), out);
	}
	const subScripts = result.matchAll(/~[0-9]+?~/g);
	for (let sub of subScripts) {
		let out = `<sub>${sub.toString().slice(1).slice(0, -1)}</sub>`;
		result = result.replace(sub.toString(), out);
	}
	const mathStuff = result.matchAll(/\$[ \S]+?\$/g);
	for (let tex of mathStuff) {
		let lestring = tex.toString()
		lestring = lestring.replaceAll('&quot;', '"');
		lestring = lestring.replaceAll('&lt;', '<');
		lestring = lestring.replaceAll('&gt;', '>');
		lestring = lestring.replaceAll('&amp;', '&');
		lestring = lestring.replaceAll('<br>', '\n')
		
		let out = katex.renderToString(lestring.slice(1).slice(0,-1),{
			throwOnError: false,
			output: 'html',
			displayMode: false,
		})
		result = result.replace(tex.toString(), out)
	}
    // console.log(result);
	const underlineRe = new RegExp(/--[\s\S]+?--/g)
	const underlines = result.matchAll(underlineRe)
	for (let underline of underlines) {
		let text = underline.toString().slice(2).slice(0, -2)
		result = result.replace(underline.toString(), `<u>${text}</u>`)
	}
	// const headerSpaceRe = new RegExp(/<h[1-3]>[\s ]+?<\/h[1-3]>\n<p>\n<br>\n<\/p>/g)
	// const headerSpaces = result.matchAll(headerSpaceRe)
	// for (let headerSpace of headerSpaces) {
	// 	let outputString = headerSpace.toString().slice(0, -10)
	// 	result = result.replace(headerSpace.toString(), outputString)
	// }
    return result
}

export { renderMd }