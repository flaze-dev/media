import React, {Component, HTMLAttributes, ReactNode} from "react";
import Head from "next/head";


interface Props extends HTMLAttributes<HTMLElement> {}


/**
 * Page Component
 * @author Ingo Andelhofs
 */
class Page extends Component<Props, never> {

  // Rendering
  private renderChildren(): ReactNode {
    return <>
      <Head>
        <title>Dev Starter</title>
        <meta name="description" content="A starter template for a React Next.js component library." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {this.props.children}
    </>
  }

  public render(): ReactNode {
    const {children, ...rest} = this.props;

    return <div
      children={this.renderChildren()}
      {...rest}
    />;
  }
}


export default Page;
