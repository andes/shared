import { SharedPage } from './app.po';

describe('shared App', function() {
  let page: SharedPage;

  beforeEach(() => {
    page = new SharedPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
