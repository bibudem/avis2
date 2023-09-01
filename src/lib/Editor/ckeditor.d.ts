/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import { InlineEditor } from '@ckeditor/ckeditor5-editor-inline';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Link } from '@ckeditor/ckeditor5-link';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import Save from './plugins/Save';
declare class Editor extends InlineEditor {
    static builtinPlugins: (typeof Save | typeof Autoformat | typeof Bold | typeof Essentials | typeof Italic | typeof Link | typeof Paragraph)[];
    static defaultConfig: {
        toolbar: {
            items: string[];
        };
        language: string;
    };
}
export default Editor;
