import InfiniteScroll from 'react-infinite-scroller';
import { Species } from './Species';
import { useInfiniteQuery } from '@tanstack/react-query';

const initialUrl = 'https://swapi.py4e.com/api/species/';
const fetchUrl = async url => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const { data, isLoading, isError, error, hasNextPage, fetchNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ['sw-species'],
      queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
      getNextPageParam: page => page.next || undefined,
    });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error.toString()}</div>;

  return (
    <>
      {isFetching && <div className="loading">Fetching...</div>}
      <InfiniteScroll
        loadMore={() => {
          if (!isFetching) fetchNextPage();
        }}
        hasMore={hasNextPage}
      >
        {data.pages.map(page =>
          page.results.map(specie => (
            <Species
              averageLifespan={specie.average_lifespan}
              language={specie.language}
              name={specie.name}
              key={specie.created}
            ></Species>
          ))
        )}
      </InfiniteScroll>
    </>
  );
}
