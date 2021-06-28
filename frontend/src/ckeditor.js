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
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload.js';
import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter';
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
                    if (bibtexText) {
                        let contents = bibtexify(bibtexText, [])
                        console.log(contents);
                        contents.forEach(content => {
                            const viewFragment = editor.data.processor.toView( content );
                            const modelFragment = editor.data.toModel(viewFragment);
                            editor.model.insertContent(modelFragment,editor.model.document.selection);
                        });
                    }                    
                });
            });
            return view;
        });
        
    }
}


export default class ClassicEditor extends ClassicEditorBase { }

ClassicEditor.builtinPlugins = [
    Base64UploadAdapter,
    Image,
    ImageUpload,
    ImageResize,
    ImageToolbar,
    ImageStyle,
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
            'undo',
            'redo',
            '|',
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            '|',
            'fontSize',
            'fontColor',
            '|',
            'alignment',
            'outdent',
            'indent',
            'bulletedList',
            'numberedList',
            '|',
            'imageUpload',
            
            'blockQuote',
            'link',
            'codeBlock',
            'insertTable',
            'MathType',            
            'bibtex',
            
        ]
    },
    image: {
        styles: [
            'alignCenter'
        ],

        toolbar: [
            'imageStyle:alignCenter'
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
                color: 'hsl(0, 0%, 100%)',
                label: 'White',
                hasBorder: true
            },
            {
                color: 'hsl(0, 75%, 60%)',
                label: 'Red'
            },
            {
                color: 'hsl(30, 75%, 60%)',
                label: 'Orange'
            },
            {
                color: 'hsl(60, 75%, 60%)',
                label: 'Yellow'
            },
            {
                color: 'hsl(90, 75%, 60%)',
                label: 'Light green'
            },
            {
                color: 'hsl(120, 75%, 60%)',
                label: 'Green'
            },
            {
                color: 'hsl(200, 100%, 70%)',
                label: 'Light blue'
            },
            {
                color: 'hsl(216, 100%, 50%)',
                label: 'Blue'
            },
            {
                color: 'hsl(276, 100%, 50%)',
                label: 'Purpel'
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
    },
    table: {
        contentToolbar: [
            'tableColumn', 'tableRow', 'mergeTableCells',
            'tableProperties', 'tableCellProperties'
        ],

    
    },
    placeholder: 'Type the content here!'
};

const bibtexIcon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="772" height="500" viewBox="0 0 772 500">
  <image id="Imagen_28" data-name="Imagen 28" width="772" height="500" xlink:href="data:image/png;base64,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VXjS5KDxMKFizoAsypp57qexKDQJAACgMh3SgxHxOJokXDWrD0yCOPBHmhVIm1Bg0a2Ntvv2377bef70UyhRwIQv6zYde0CVQoQtxpHckxZcoU97ArSucNrY3r1q2bXXrppb4ncQgECaBAsGHDBt9KPeZAIhE+/vhja9u2rU2YMMH3hKdp06b25ptvWunSpX0Pki3kp/Ah3Vgi61avXu2PUi/UUVAk1muvveYqCoU0OpUVmrb76KOPJmVvHQJBAuiJfEgnEQIBckPh9u6777bOnTvbnDlzfG94TjnlFPvggw9s77339j3IC7/88os/Co8u7uvXr/ctREVIlV0IBOlN90daa6Yn7KGuh9sZjQyceOKJbqqQpgwlA4EgATTEGNKQE4EAObVixQo3Reimm24Keuhc28o/9dRTVqhQId+DvLJ48WJ/FB7NCV6wYIFvISq043koCJTp7eGHH3Z76IRaKW9Xjj/+eFcFqXjx4r4n8QgECaATiDa0CAWBANmlm3/tdNikSRObNGlSsN8h7cg4ZMgQV3dZx8h7od9wR62OOMy+//57f5R6IV3LkTialvbvf//brrnmmkits9TIgBYPK8gkY5rQjggECfDtt98G9TSVJxzIDm3Vftxxx1nv3r1t4cKFvjc82lvgnXfesUsuucT3IK/pQjp//nzfCtOMGTP8EaJAxQo+++wz30q9qD05xu7pIUb37t1dcYwoLRpXANDUWK0ZyIt1cgSCBJg4caI/CgML65AVmuZ27bXX2uGHH27vv/++7w1Ty5YtXRho3bq170EqaH3J0qVLfStMU6dO9UeIAj25DWlhpyqrIX2MGTPGOnToYB999FGkSrIrDFx99dUuDOTV1FgCQS7p6YYWqISEJxz4J7qp00Yshx12mA0ePDjoGzwtnlJVBf15a9eu7XuRKgqRS5Ys8a0w/fTTT+xHECE6/4S0Bk/hJOSF88gafaeuv/5669Kli82dO9f3RkOpUqVs4MCBdsMNN+TpOjkCQS5999139sMPP/hWGEJe9IfU+uqrr1ypzpNPPtm+/PJL3xsmrRF45pln7LHHHnMnSKTeJ598EvwTVC1QDT204A8zZ84MLsDpz4To0nVu3333ddXyorimcujQoda3b1/Lnz+/78kbBIJceu+99/xROEKeB468p2HS8ePHu7mIrVq1cmsGQteuXTu3/4GCC8KhObih0xQUTRNANLz00kvBTeUIbRowskYPQ7VwWNNgQ9rbIquaNWtm06ZNc6P3qUAgyKXXX3/dH4UjasNjSA5NDfr000/t6KOPdnMohw8fHtQGejtTtGhRu/DCC91mYwcffLDvRQh0oRo3bpxvhUs3l7fddhvFFSJAT3Lfeust3wqHAmWU5pvHnW7+X375ZWvcuLGrxhO1MJCRkeEKe4wePdoaNmzoe/MegSAXtHZg8uTJvhUOTWNCfOlCpqduLVq0sCOPPNKNYmmtS+jq1q3rFg7fc889Sdt4BTn3wAMP+KPwaZRU5WkRrs2bN7v9TkK88WbaWTTouqZppXqy3qtXL1u+fLn/JDoUBjQtVoGmRIkSvjc19vj//yiJwTmgUqO64QrxKZRWp6uMm26wEA+6qH799dfuCYNOkKGta/knKqd2+umn24033shagUC9++671q1bt+BHmHZUqVIlGzVqlNWvX9/3ICSvvPKKnX/++UHuDKwHEipk0L59e9+DkGgDTf3b1n40X3zxRSRHc/bYYw83hVeFPQ466CDfm1oEghzQl+/QQw91Q+ih0p+PebTxoJs1lSf75ptvfE906Kbtgw8+sFq1avkehEajoEcccYRt2rTJ90SHFuVpXwIejoRF0xe1pilkmscdejnmuNGo0oABA9xNdJQ2F/srPbTt16+fXXXVVb4nDEwZyiY9hVWqCzkMiGpxczJLT6ryouHFM88802rWrGnHHHNM5MJAxYoV3Ul91qxZhIFA6YL7wgsvuA19ohgGRP8N2vJfVTvYwT31NMI0aNAgu+iii3xPuD7++GN7/vnnfQupojKwut6ddtppVrVqVbvzzjsjHQbatGljb7/9tl1xxRW+JxyMEGSR5qbpoqJtr6MybL7PPvu4UKDyW4gmjUatWbPG1erWAmGtDRg7dmwk1gT8lYZINUdSi6c0Hz0v6ysj63Sx1ZSzW265xT3JjeJ37a+0/f9JJ53k5qzvt99+rqQt8o5qwmttW58+fVzp2qjQgwstek7lQs+40U7CeuildUCaW6+pZVHaXXhXypcv7yog6ZXX5USzikCwG99//71bnKbFjippFbWnTDqh3XvvvXbCCSf4HkSBnvhrjqSm02ijpdA278mJrl272q233mp16tRxN2gIi278X331VTcvVzdv6bjjebFixdz379xzz7VTTz2VUJpkur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"/>
</svg>`