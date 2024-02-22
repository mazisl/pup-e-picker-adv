import {ReactNode, createContext, useState, useEffect, useContext} from 'react';
import toast from "react-hot-toast";
import { Requests } from '../api';
import type { Dog } from '../types';

type ActiveSelector = 'all' | 'favorited' | 'unfavorited' | 'createDog';

type TDogList = {
  all: Dog[],
  favorited: Dog[],
  unfavorited: Dog[]
}

type TDogsProvider = {
  favoriteDogList: Dog[],
  notFavoriteDogList: Dog[],
  handleActiveSelector: (state: ActiveSelector) => void,
  activeSelector: ActiveSelector,
  createDog: (dog: Omit<Dog, "id">) => Promise<unknown>,
  isLoading: boolean,
  dogList: TDogList,
  onTrashIconClick: (dog: Dog) => void,
  handleHeartClick: (dog: Dog, isFavorite: boolean) => void
}

const DogsContext = createContext<TDogsProvider>({} as TDogsProvider);

export const DogsProvider = ({children}: {children: ReactNode}) => {
  const [allDogs, setAllDogs] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeSelector, setActiveSelector] = useState<ActiveSelector>("all");

  //this func fetches dogs from db and updates state of allDogs with the fetched dogs array
  const refetchDogs = () => {
    setIsLoading(true);
    return Requests.getAllDogs()
      .then((dogs) => setAllDogs(dogs))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    refetchDogs()
      .catch(() => toast.error('Failed to refetch dogs!'));
  }, []);

  const favoriteDogList = allDogs.filter((dog) => dog.isFavorite);
  const notFavoriteDogList = allDogs.filter((dog) => !dog.isFavorite);

  const dogList: TDogList = {
    all: allDogs,
    favorited: favoriteDogList,
    unfavorited: notFavoriteDogList
  };

  //this func changes activeSelector state and displays the list of dogs as per active selector
  //if a tab is already active and displaying it's list, clicking that tab again will remove it's active status and the full list of dogs will be displayed
  const handleActiveSelector = (state: ActiveSelector) => {
    const newSelector = activeSelector === state ? "all" : state;
    setActiveSelector(newSelector);
  };

  //this func creates new dog in db, fetches all the dogs from db and updates state of allDogs
  const createDog = (dog: Omit<Dog, "id">) => {
    setIsLoading(true);
    return Requests.postDog(dog)
      .then(() => refetchDogs())
      .then(() => {
        toast.success("Thanks for creating a new dog! 😃");
      })
      .finally(() => setIsLoading(false))
  };

  const onTrashIconClick = (dog: Dog) => {
    // Keep a copy of the previous state for potential rollback
    const prevDogs = [...allDogs];
  
    // Optimistic rendering: Remove clicked dog from the list immediately
    setAllDogs((prevDogs) => prevDogs.filter((d) => d.id !== dog.id));
    
    //rollback to the previous state incase of error with fetch request
    Requests.deleteDog(dog)
      .catch(() => {
        toast.error(`Error deleting dog`);
        setAllDogs(prevDogs);
      });
  };

  const handleHeartClick = (dog: Dog, isFavorite: boolean) => {
    //keep a copy of the previous state for potential rollback
    const prevDogs = [...allDogs];
  
    // Optimistic rendering: Update the isFavorite status immediately
    setAllDogs((prevDogs) =>
      prevDogs.map((d) => (d.id === dog.id ? { ...d, isFavorite } : d))
    );
  
    const dogCopy = { ...dog, isFavorite };
    
    //rollback to the previous state incase of error with fetch request
    Requests.updateDog(dogCopy)
      .catch(() => {
        toast.error(`Error updating dog`);
        setAllDogs(prevDogs);
      });
  };

  const value = {
    favoriteDogList,
    notFavoriteDogList,
    handleActiveSelector,
    activeSelector,
    createDog,
    isLoading,
    dogList,
    onTrashIconClick,
    handleHeartClick
  }

  return (
    <DogsContext.Provider value={value}>{children}</DogsContext.Provider>
  )
}

export const useDogs = () => useContext(DogsContext);