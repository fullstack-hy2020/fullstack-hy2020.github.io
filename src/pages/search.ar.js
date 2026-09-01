import React from 'react';
import { graphql } from 'gatsby';

import SearchPage from '../components/SearchPage';

const Search = ({ data }) => (
  <SearchPage
    localSearch={data.localSearchFinnish}
    title="ابحث في محتوى الدورة"
    inputPlaceholder="أدخل عبارة ما للبحث"
    lang="ar"
  />
);

export const pageQuery = graphql`
  query {
    localSearchFinnish {
      store
      index
    }
  }
`;

export default Search;
