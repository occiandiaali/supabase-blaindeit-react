import { supabase } from "../supabaseClient";
import fakeUsers from "../data/fakeUsers";

export const fetchMembers = async (page, limit) => {
  const response = await fetch();
  const { data, error } = await supabase.from("profiles").select();

  if (error) throw error.message;
  if (data) {
    // console.log(data);

    setMembers(fakeUsers.concat(data));
    //  console.log(members);
    setFilteredMembers(fakeUsers.concat(data));
  }

  return data;
};

import { useInfiniteQuery } from "react-query";

const useInfiniteMembers = () => {
  return useInfiniteQuery(
    "members",
    async ({ pageParam = 0 }) => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .range(pageParam, pageParam + 9); // Fetch 10 items
      return data;
    },
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.length ? pages.length * 10 : undefined,
    }
  );
};

const handleScroll = () => {
  if (
    window.innerHeight + document.documentElement.scrollTop !==
    document.documentElement.offsetHeight
  )
    return;
  fetchNextPage(); // Call to fetch the next page
};

useEffect(() => {
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

import { useInfiniteQuery } from "@tanstack/react-query";

const fetchProfiles = async ({ pageParam = 0 }) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .range(pageParam, pageParam + 9); // Fetch 10 items at a time
  if (error) throw new Error(error.message);
  return data;
};

function Products() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery("profiles", fetchProfiles, {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.length ? pages.length * 10 : undefined;
      },
    });

  return (
    <div>
      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.map((product) => (
            <div key={product.id}>{product.name}</div>
          ))}
        </React.Fragment>
      ))}
      <button
        onClick={fetchNextPage}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? "Loading more..." : "Load More"}
      </button>
    </div>
  );
}
