import MovieCastShow from "@/components/MovieCastShow";
import ShowMovieDetail from "@/components/ShowMovieDetail";
import React from "react";

type Props = {
  params: {
    movieId: string;
  };
};

const page = ({ params }: Props) => {
  const { movieId } = params;
  return (
    <div className="pt-20">
      <ShowMovieDetail movieId={movieId} />
    </div>
  );
};

export default page;
