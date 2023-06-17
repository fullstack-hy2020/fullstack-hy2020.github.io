import React from 'react';
import { graphql } from 'gatsby';

import SearchPage from '../components/SearchPage';

const Search = ({ data }) => (
  <SearchPage
    localSearch={data.localSearchPortuguese}
    title="Pesquise no material"
    inputPlaceholder="Pesquisar"
    lang="ptbr"
  />
);

export default Search;

export const pageQuery = graphql`
  query {
    localSearchPortuguese {
      store
      index
    }
  }
`;
