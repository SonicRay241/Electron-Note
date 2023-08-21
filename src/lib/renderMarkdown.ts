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
    let ree = markdown.replaceAll('\n\n', '\n\n[//s.#]\n');
    ree = ree.replaceAll('---', '\n[//l.#]\n');
	console.log(ree);
	result = md.render(ree);
	result = result.replaceAll(
		'[//l.#]',
		'<hr>',
	);
	result = result.replaceAll(
		'[//s.#]',
		'<br>',
	);
	
	const re = new RegExp(/<code>[\s\S]*?<\/code>/g);
	const codes = result.matchAll(re);
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
		outputCode = outputCode.slice(1).slice(0, -1)
        outputCode = `<code>${outputCode}</code>`
		outputCode = outputCode.replaceAll('\n\n', '<br>')
		outputCode = outputCode.replaceAll('\n', '<br>')
		// outputCode = outputCode.replace('<br>', '')
		outputCode = outputCode.replaceAll('<br><br>', '<br>')
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
	const mathStuff = result.matchAll(/\$[\s\S]+?\$/g);
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
        
    return result
}

export { renderMd }