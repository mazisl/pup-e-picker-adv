// Right now these dogs are constant, but in reality we should be getting these from our server
// Todo: Refactor to get rid of props (THERE SHOULD BE NO PROPS DRILLING ON THIS COMPONENT)
import { useDogs } from "../contexts/dogs.context";

import { DogCard } from "./DogCard";
import { Dog } from "../types";

export const Dogs = () => {

  const {dogList, activeSelector, isLoading, onTrashIconClick, handleHeartClick} = useDogs();

  return (
    <>
      {dogList[activeSelector].map((dog: Dog) => {
        return (
          <DogCard
            key={dog.id}
            dog={dog}
            isLoading={isLoading}
            trashClickHandler={onTrashIconClick}
            handleHeartClick={handleHeartClick}
          />
        );
      })}
    </>
  );
};

