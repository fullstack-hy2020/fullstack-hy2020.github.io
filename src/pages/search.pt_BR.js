import React from 'react';
import { graphql } from 'gatsby';

import SearchPage from '../components/SearchPage';

const Search = ({ data }) => (
  <SearchPage
    localSearch={data.localSearchFinnish}
    title="Pesquise no material"
    inputPlaceholder="Digite um termo de pesquisa"
    lang="pt-BR"
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