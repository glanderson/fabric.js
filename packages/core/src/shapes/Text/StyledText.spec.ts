import { FabricText } from './Text';
import { graphemeSplit } from '../../util/lang_string';
import { Group } from '../Group';
import { StaticCanvas } from '../../canvas/StaticCanvas';

import { describe, expect, it, test } from 'vitest';

describe('setSelectionStyles', () => {
  test('will set properties at the correct position', () => {
    const text = new FabricText('Hello', {
      styles: {
        0: {
          0: {
            fontSize: 33,
            fill: 'blue',
            deltaY: 44,
          },
        },
      },
    });
    const [style1, style2] = text.getSelectionStyles(0, 2);
    expect(style1.fontSize).toBe(33);
    expect(style1.deltaY).toBe(44);
    expect(style1.fill).toBe('blue');
    expect(style2).toEqual({});
    text.setSelectionStyles(
      {
        fontSize: undefined,
        deltaY: 0,
      },
      0,
      2,
    );
    const [style1After, style2After] = text.getSelectionStyles(0, 2);
    expect(Object.hasOwn(style1After, 'fontSize')).toBe(false);
    expect(style1After.deltaY).toBe(0);
    expect(style1After.fill).toBe('blue');
    expect(style2After).toEqual({
      deltaY: 0,
    });
  });

  test('marks text and parent group dirty so style changes re-render', () => {
    const canvas = new StaticCanvas(undefined, {
      width: 200,
      height: 100,
      enableRetinaScaling: false,
    });
    const text = new FabricText('Hello', {
      objectCaching: true,
    });
    const group = new Group([text], { objectCaching: true });
    canvas.add(group);
    canvas.renderAll();

    expect(text.dirty, 'text should be clean after render').toBe(false);
    expect(group.dirty, 'group should be clean after render').toBe(false);

    text.setSelectionStyles({ underline: true }, 0, 5);

    expect(text._forceClearCache, 'text cache must be forced clear').toBe(true);
    expect(text.dirty, 'text must be dirty after style change').toBe(true);
    expect(
      group.dirty,
      'parent group must be dirty so its cache is invalidated',
    ).toBe(true);
  });
});

describe('toObject', () => {
  it('Will serialize text with graphemes in mind', () => {
    const text = new FabricText('🤩🤩\nHello', {
      styles: {
        1: {
          0: {
            fontSize: 40,
          },
        },
      },
    });
    const serializedStyles = text.toObject().styles;
    expect(serializedStyles).toEqual([
      { start: 2, end: 3, style: { fontSize: 40 } },
    ]);
    expect(serializedStyles[0].start).toEqual(
      graphemeSplit(text.textLines[0]).length,
    );
  });
});
