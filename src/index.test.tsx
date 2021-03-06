import * as React from 'react';
import toJSON from 'enzyme-to-json';
import { mount, ReactWrapper } from 'enzyme';
import CodeBlock from './index';
import 'jest-styled-components';

const code = `
const greeting = (greet = 'Hello') => (name = 'World') => {
    return greet + ' ' + name + '!';
  };
`;

export interface JSXBlockProps {
  code: string;
}

const JSXBlock = ({ code }: JSXBlockProps) => (
  <pre>
    <code>{code}</code>
  </pre>
);

const stringBlock = `<pre><code>${code}</code></pre>`;

describe('Copy to code', () => {
  let wrapper: ReactWrapper<any, Readonly<{}>>;
  afterEach(() => {
    if (wrapper) wrapper.unmount();
  });
  it('Renders component with JSX', () => {
    wrapper = mount(
      <CodeBlock>
        <JSXBlock code={code} />
      </CodeBlock>,
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('Renders component with highlight', () => {
    wrapper = mount(
      <CodeBlock highlight>
        <JSXBlock code={code} />
      </CodeBlock>,
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('Renders custom element', () => {
    wrapper = mount(
      <CodeBlock element='span'>
        <JSXBlock code={code} />
      </CodeBlock>,
    );
    const html = wrapper.html();
    expect(html.indexOf('span')).toBe(1);
  });

  it('adds a div wrapper around pre code block', () => {
    wrapper = mount(
      <CodeBlock>
        <JSXBlock code={code} />
      </CodeBlock>,
    );
    const html = wrapper.html();
    expect(/class=\"clipWrapper\"/.test(html)).toBe(true);
  });

  it('adds a button sibling to pre code block', () => {
    wrapper = mount(
      <CodeBlock>
        <JSXBlock code={code} />
      </CodeBlock>,
    );
    const html = wrapper.html();
    expect(/button/.test(html)).toBe(true);
  });

  it('adds custom svg icon', () => {
    const testString =
      'm20.1 13.9l4.5 6.8h-8.9z m8.2 11.8h2.1l-10.3-15.4-10.2 15.4h2.1l2.3-3.6h11.7z m9-5.7q0 4.7-2.3 8.6t-6.3 6.2-8.6 2.3-8.6-2.3-6.2-6.2-2.3-8.6 2.3-8.6 6.2-6.2 8.6-2.3 8.6 2.3 6.3 6.2 2.3 8.6z';
    const SVG = () => (
      <svg>
        <g>
          <path d={testString} />
        </g>
      </svg>
    );
    wrapper = mount(
      <CodeBlock svg={SVG}>
        <JSXBlock code={code} />
      </CodeBlock>,
    );
    const html = wrapper.html();

    expect(new RegExp(testString, 'g').test(html)).toBe(true);
  });

  it('calls onCopy function', () => {
    const spy = jest.fn();
    wrapper = mount(
      <CodeBlock onCopy={spy}>
        <JSXBlock code={code} />
      </CodeBlock>,
    );

    (window as any)['copyToClipBoard']();
    expect(spy.mock.calls.length).toBe(1);
  });
});

describe('Copy to code with innerHtml', () => {
  let wrapper: ReactWrapper<any, Readonly<{}>>;
  afterEach(() => {
    if (wrapper) wrapper.unmount();
  });
  it('Renders component', () => {
    wrapper = mount(<CodeBlock innerHtml>{stringBlock}</CodeBlock>);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('Renders component with highlight', () => {
    wrapper = mount(
      <CodeBlock highlight innerHtml>
        {stringBlock}
      </CodeBlock>,
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
