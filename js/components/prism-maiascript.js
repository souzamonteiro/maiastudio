Prism.languages.maiascript = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true,
			greedy: true
		}
	],
	'string': {
		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'keyword': /\b(?:namespace|async|constructor|function|if|elseif|else|do|while|for|foreach|try|test|catch|break|continue|return|throw|import|require|null)\b/,
	'boolean': /\b(?:true|false)\b/,
	'function': /\w+(?=\()/,
	'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
	'operator': /[<>]=?|[:=]|[\?=]|[!=]=?=?|`|&&?|\|\|?|&\||[?*/~^%]/,
	'punctuation': /[{}[\];(),.]/
};

Prism.languages.maia = Prism.languages['maiascript'];