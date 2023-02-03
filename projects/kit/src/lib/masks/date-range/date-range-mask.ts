import {MaskitoOptions, maskitoPipe} from '@maskito/core';

import {CHAR_EN_DASH, CHAR_NO_BREAK_SPACE} from '../../constants';
import {
    createMinMaxDatePostprocessor,
    createValidDatePreprocessor,
    createZeroPlaceholdersPreprocessor,
} from '../../processors';
import {MaskitoDateMode} from '../../types';

const DATE_RANGE_SEPARATOR = `${CHAR_NO_BREAK_SPACE}${CHAR_EN_DASH}${CHAR_NO_BREAK_SPACE}`;

export function maskitoDateRangeOptionsGenerator({
    mode,
    separator = '.',
    min,
    max,
}: {
    mode: MaskitoDateMode;
    separator?: string;
    min?: Date;
    max?: Date;
}): MaskitoOptions {
    const dateModeTemplate = mode.split('/').join(separator);
    const dateMask = Array.from(dateModeTemplate).map(char =>
        char === separator ? char : /\d/,
    );

    return {
        mask: [...dateMask, ...DATE_RANGE_SEPARATOR, ...dateMask],
        overwriteMode: 'replace',
        preprocessor: maskitoPipe(
            createZeroPlaceholdersPreprocessor(),
            createValidDatePreprocessor({
                dateModeTemplate,
                dateSegmentsSeparator: separator,
                datesSeparator: DATE_RANGE_SEPARATOR,
            }),
        ),
        postprocessor: createMinMaxDatePostprocessor({
            min,
            max,
            dateModeTemplate,
            datesSeparator: DATE_RANGE_SEPARATOR,
        }),
    };
}