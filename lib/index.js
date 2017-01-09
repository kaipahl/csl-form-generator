'use strict';

/**
 * @typedef {Object} CSLStyles
 * @type {Object}
 * @property {Object} style
 * @property {Object} style
 * @property style.macro
 */

let
	fs = require('fs'),
	path = require('path'),
	parseXml = require('xml2js').parseString,
	paths = {
		csl: 'source/style-master/',
		css: 'source/csl-styles.css',
		mla8: 'source/styles-master/modern-language-association-8th-edition.csl',
		dest: 'public/'
	},
	html = {
		top: `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><title>CSL Style</title><style>##css##</style></head><body>`,
		bottom: '</body></html>'
	};


module.exports = {

	getRootPath: function() {
		return path.dirname(process.mainModule.filename);
	},


	buildHtmlMacro: function( macroName ) {
		let
			htmlFormRowStart = `<div class="form__row">`,
			htmlFormRowEnd = `</div>`,
			htmlLabel = `<label>${macroName}</label>`,
			htmlField = `<input type="text" value="" placeholder="${macroName}" />`,
			htmlContent = htmlFormRowStart;

		htmlContent += htmlLabel + htmlField;
		htmlContent += htmlFormRowEnd;

		return htmlContent;

	},

	/**
	 *
	 * @param {string} cslData
	 */
	parseCsl: function( cslData ) {
		let
			that = this,
			xmlContent = {},
			htmlContent = '',
			macros,
			macroNames;

		parseXml(cslData, function(err, result) {
			xmlContent = result;
		});

		macros = xmlContent.style.macro;

		macroNames = macros.map( function( macro ) {
			return macro['$'].name;
		});

		macroNames.forEach( function( name ) {
			// htmlContent += name + '\n';
			htmlContent += that.buildHtmlMacro(name) + '\n';
		});

		return htmlContent;
	},



	/**
	 *
	 * @param parameter
	 * @returns {string}
	 */
	getFileContent: function( parameter ) {
		let
			that = this,
			cslData,
			cssContent = that.readCssFile(),
			htmlContent = html.top.replace('##css##', cssContent);

		cslData = fs.readFileSync(paths.mla8, {encoding: 'utf-8'});

		htmlContent += that.parseCsl(cslData);
		htmlContent += html.bottom;

		return htmlContent;
	},



	/**
	 *
	 * @returns {string}
	 */
	readCssFile: function() {
		return fs.readFileSync(paths.css, {encoding: 'utf-8'});
	},



	/**
	 *
	 * @param {string} filePath
	 * @param {string} fileContent
	 * @returns {void}
	 */
	writeFile: function(filePath, fileContent) {
		fs.writeFileSync(filePath, fileContent, 'utf8');
	},



	/**
	 *
	 * @param {string} cslType
	 */
	generateHtmlFormFile: function( cslType ) {
		let
			that = this,
			filePath,
			fileContent;

		filePath = this.getRootPath() + `/${paths.dest}/${cslType}.html`;
		fileContent = that.getFileContent(cslType);
		that.writeFile(filePath, fileContent);
	},



	/**
	 * @description main routine
	 */
	main: function() {
		let that = this;

		that.generateHtmlFormFile('mla8');
	}

};
