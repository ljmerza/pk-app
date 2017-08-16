import { PkAppPage } from './app.po';

describe('pk-app App', () => {
  let page: PkAppPage;

  beforeEach(() => {
    page = new PkAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
