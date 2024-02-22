import { ReactNode } from "react";
import { useDogs } from "../contexts/dogs.context";

interface SectionLayoutProps {
  label: string;
  children: ReactNode;
}

//only label and children allowed as props in this component
export const Section = ({
  label,
  children
}: SectionLayoutProps) => {

  const {favoriteDogList, notFavoriteDogList, activeSelector, handleActiveSelector} = useDogs();

  return (
    <section id="main-section">
      <div className="container-header">
        <div className="container-label">{label}</div>
        <div className="selectors">
          {/* This should display the favorited count */}
          <div
            className={`selector ${
              activeSelector === "favorited" ? "active" : ""
            }`}
            onClick={() => {
              handleActiveSelector("favorited");
            }}
          >
            Favorited ({favoriteDogList.length})
          </div>

          {/* This should display the unfavorited count */}
          <div
            className={`selector ${
              activeSelector === "unfavorited" ? "active" : ""
            }`}
            onClick={() => {
              handleActiveSelector("unfavorited");
            }}
          >
            Unfavorited ({notFavoriteDogList.length})
          </div>

          <div
            className={`selector ${
              activeSelector === "createDog" ? "active" : ""
            }`}
            onClick={() => {
              handleActiveSelector("createDog");
            }}
          >
            Create Dog
          </div>
        </div>
      </div>

      <div className="content-container">{children}</div>
    </section>
  );
};
