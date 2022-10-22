import React from 'react';
import { graphql } from 'gatsby';

import SearchPage from '../components/SearchPage';

const Search = ({ data }) => (
  <SearchPage
    localSearch={data.localSearchFinnish}
    title="Ricerca di un contenuto"
    inputPlaceholder="Inserisci un termine di ricerca"
    lang="it"
  />
);

export default Search;

export const pageQuery = graphql`
  query {
    localSearchFinnish {
      store
      index
    }
  }
`;
