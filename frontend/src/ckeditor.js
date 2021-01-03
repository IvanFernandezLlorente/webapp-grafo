import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
import Link from '@ckeditor/ckeditor5-link/src/link';
import AutoLink from '@ckeditor/ckeditor5-link/src/autolink';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock';
import Font from '@ckeditor/ckeditor5-font/src/font';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock'
import ListStyle from '@ckeditor/ckeditor5-list/src/liststyle';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';
import MathType from '@wiris/mathtype-ckeditor5/src/plugin';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import bibtexIcon from '@ckeditor/ckeditor5-font/theme/icons/font-family.svg';

import { bibtexify } from './bib-list';

class Bibtex extends Plugin {

    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add( 'bibtex', locale => {
            const view = new ButtonView( locale );

            view.set( {
                label: 'Add BibTeX',
                icon: bibtexIcon,
                tooltip: true
            } );
            
            view.on('execute', () => {
                
                editor.model.change( () => {
                    const bibtexText = prompt('BibTeX');
                    
                    let contents = bibtexify(bibtexText, [])
                    contents.forEach(content => {
                        const viewFragment = editor.data.processor.toView( content );
                        const modelFragment = editor.data.toModel(viewFragment);
                        editor.model.insertContent(modelFragment,editor.model.document.selection);
                    });
                });
            });
            return view;
        });
        
    }
}


export default class ClassicEditor extends ClassicEditorBase { }

ClassicEditor.builtinPlugins = [
    EssentialsPlugin,
    Paragraph,
    Alignment,
    Link,
    AutoLink,
    BlockQuote,
    Bold,
    Italic,
    Underline,
    CodeBlock,
    Font,
    Heading,
    Indent,
    IndentBlock,
    Table,
    TableToolbar,
    TableProperties,
    TableCellProperties,
    ListStyle,
    MathType,
    Bibtex
];

ClassicEditor.defaultConfig = {
    plugins: ClassicEditor.builtinPlugins,

    toolbar: {
        items: [
            'bold',
            'italic',
            'underline',
            'link',
            'alignment',
            'blockQuote',
            'codeBlock',
            'fontSize',
            'fontColor',
            'heading',
            'outdent',
            'indent',
            'bulletedList',
            'numberedList',
            'insertTable',
            'MathType',
            'undo',
            'redo',
            'bibtex'
        ]
    },
    alignment: {
        options: [ 'left', 'right', 'center', 'justify' ]
    },
    link: {
        addTargetToExternalLinks: true,
    },
    codeBlock: {
        languages: [
            { language: 'plaintext', label: 'Plain text' }, // The default language.
            { language: 'c', label: 'C' },
            { language: 'cs', label: 'C#' },
            { language: 'cpp', label: 'C++' },
            { language: 'css', label: 'CSS' },
            { language: 'diff', label: 'Diff' },
            { language: 'html', label: 'HTML' },
            { language: 'java', label: 'Java' },
            { language: 'javascript', label: 'JavaScript' },
            { language: 'php', label: 'PHP' },
            { language: 'python', label: 'Python' },
            { language: 'ruby', label: 'Ruby' },
            { language: 'typescript', label: 'TypeScript' },
            { language: 'xml', label: 'XML' }
        ]
    },
    fontColor: {
        colors: [
            {
                color: 'hsl(0, 0%, 0%)',
                label: 'Black'
            },
            {
                color: 'hsl(0, 0%, 30%)',
                label: 'Dim grey'
            },
            {
                color: 'hsl(0, 0%, 60%)',
                label: 'Grey'
            },
            {
                color: 'hsl(0, 0%, 90%)',
                label: 'Light grey'
            },
            {
                color: 'hsl(0, 0%, 100%)',
                label: 'White',
                hasBorder: true
            },
        ],

        columns: 3, 
    },
    fontSize: {
        options: [
            9,
            10,
            11,
            12,
            14,
            16,
            18,
            20
        ]
    },
    heading: {
        options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
            { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
            { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
        ]
    }
};