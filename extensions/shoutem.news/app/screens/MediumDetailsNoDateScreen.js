import React from 'react';
import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';
import { Caption, Tile, Title, View } from '@shoutem/ui';
import { getRouteParams } from 'shoutem.navigation';
import { ext } from '../const';
import { ArticleDetailsScreen } from './ArticleDetailsScreen';

export class MediumDetailsNoDateScreen extends ArticleDetailsScreen {
  renderHeader() {
    const { article, disableUppercasing } = getRouteParams(this.props);

    const resolvedTitle = disableUppercasing
      ? article.title
      : article.title.toUpperCase();
    const author = _.get(article, 'newsAuthor');
    const shouldDisplayAuthor = !_.isEmpty(author);

    return (
      <Tile styleName="text-centric md-gutter-top sm-gutter-bottom">
        <Title>{resolvedTitle}</Title>
        {shouldDisplayAuthor && (
          <View styleName="horizontal sm-gutter-top sm-gutter-bottom">
            <Caption numberOfLines={1}>{author}</Caption>
          </View>
        )}
      </Tile>
    );
  }
}

export default connectStyle(ext('ArticleDetailsScreen'))(
  MediumDetailsNoDateScreen,
);
