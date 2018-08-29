/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import SuperEditing from '../../src/superscript/superscriptediting';

import VirtualTestEditor from '@ckeditor/ckeditor5-core/tests/_utils/virtualtesteditor';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import AttributeCommand from '../../src/attributecommand';

import { getData as getModelData, setData as setModelData } from '@ckeditor/ckeditor5-engine/src/dev-utils/model';
import { getData as getViewData } from '@ckeditor/ckeditor5-engine/src/dev-utils/view';

describe( 'SuperEditing', () => {
	let editor, model;

	beforeEach( () => {
		return VirtualTestEditor
			.create( {
				plugins: [ Paragraph, SuperEditing ]
			} )
			.then( newEditor => {
				editor = newEditor;
				model = editor.model;
			} );
	} );

	afterEach( () => {
		return editor.destroy();
	} );

	it( 'should be loaded', () => {
		expect( editor.plugins.get( SuperEditing ) ).to.be.instanceOf( SuperEditing );
	} );

	it( 'should set proper schema rules', () => {
		expect( model.schema.checkAttribute( [ '$root', '$block', '$text' ], 'sup' ) ).to.be.true;
		expect( model.schema.checkAttribute( [ '$clipboardHolder', '$text' ], 'sup' ) ).to.be.true;
	} );

	describe( 'command', () => {
		it( 'should register super command', () => {
			const command = editor.commands.get( 'super' );

			expect( command ).to.be.instanceOf( AttributeCommand );
			expect( command ).to.have.property( 'attributeKey', 'super' );
		} );
	} );

	describe( 'data pipeline conversions', () => {
		it( 'should convert <sup> to sup attribute', () => {
			editor.setData( '<p><sup>foo</sup>bar</p>' );

			expect( getModelData( model, { withoutSelection: true } ) )
				.to.equal( '<paragraph><$text sup="true">foo</$text>bar</paragraph>' );

			expect( editor.getData() ).to.equal( '<p><sup>foo</sup>bar</p>' );
		} );

		it( 'should convert vertical-align:super to sup attribute', () => {
			editor.setData( '<p><span style="vertical-align: sup;">foo</span>bar</p>' );

			expect( getModelData( model, { withoutSelection: true } ) )
				.to.equal( '<paragraph><$text sup="true">foo</$text>bar</paragraph>' );

			expect( editor.getData() ).to.equal( '<p><sup>foo</sup>bar</p>' );
		} );

		it( 'should be integrated with autoparagraphing', () => {
			editor.setData( '<sup>foo</sup>bar' );

			expect( getModelData( model, { withoutSelection: true } ) )
				.to.equal( '<paragraph><$text sup="true">foo</$text>bar</paragraph>' );

			expect( editor.getData() ).to.equal( '<p><sup>foo</sup>bar</p>' );
		} );
	} );

	describe( 'editing pipeline conversion', () => {
		it( 'should convert attribute', () => {
			setModelData( model, '<paragraph><$text sup="true">foo</$text>bar</paragraph>' );

			expect( getViewData( editor.editing.view, { withoutSelection: true } ) ).to.equal( '<p><sup>foo</sup>bar</p>' );
		} );
	} );
} );
