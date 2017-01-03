'use strict';

let
	fs = require('fs'),
	path = require('path'),
	parseXml = require('xml2js').parseString,
	paths = {
		csl: 'source/style-master/',
		mla8: 'source/styles-master/modern-language-association-8th-edition.csl',
		dest: 'public/'
	};


module.exports = {

	getRootPath: function() {
		return path.dirname(process.mainModule.filename);
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
			htmlContent += name + '\n';
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
			htmlContent;

		cslData = fs.readFileSync(paths.mla8, {encoding: 'utf-8'});

		htmlContent = that.parseCsl(cslData);

		return htmlContent;
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
