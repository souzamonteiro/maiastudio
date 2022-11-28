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
	'keyword': /\b(?:break|case|catch|continue|default|do|else|export|f32|f64|for|foreach|i32|i64|if|import|include|global|local|null|return|switch|test|throw|try|while)\b/,
	'boolean': /\b(?:true|false)\b/,
	'function': /\w+(?=\()/,
	'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
	'operator': /[<>]=?|[\?=][:=][#=]|[!=]=?=?|`|&&?|\|\||--|\+\+|[?:*/~^%]/,
	'punctuation': /[{}[\];(),.]/
};

Prism.languages.maia = Prism.languages['maiascript'];