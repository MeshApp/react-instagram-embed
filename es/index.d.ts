import * as React from 'react';
declare global {
  interface Window {
    instgrm: any;
  }
}
export interface Props<T = 'div'> {
  url: string;
  accessToken: string;
  hideCaption: boolean;
  containerTagName: T;
  protocol: string;
  injectScript: boolean;
  maxWidth?: number;
  className?: string;
  onLoading?(): void;
  onSuccess?(response: Response): void;
  onAfterRender?(): void;
  onFailure?(arg: any): void;
}
declare type Html = string;
interface Response {
  version: string;
  title: string;
  author_name: string;
  author_url: string;
  author_id: number;
  media_id: string;
  provider_name: 'Instagram';
  provider_url: string;
  type: string;
  width: number | null;
  height: number | null;
  html: Html;
  thumbnail_width: number;
  thumbnail_height: number;
}
interface State {
  html: Html | null;
}
export default class InstagramEmbed extends React.PureComponent<Props, State> {
  public static defaultProps: {
    hideCaption: boolean;
    containerTagName: string;
    protocol: string;
    injectScript: boolean;
  };
  public cancel: () => void;
  private request;
  private timer?;
  private fetchEmbed;
  private omitComponentProps;
  private injectScript;
  private checkAPI;
  private getQueryParams;
  private handleFetchSuccess;
  private handleFetchFailure;
  private createRequestPromise;
  constructor(props: Props);
  public componentDidMount(): void;
  public componentDidUpdate(prevProps: Props): void;
  public componentWillUnmount(): void;
  public render(): React.ReactNode;
}
export {};
