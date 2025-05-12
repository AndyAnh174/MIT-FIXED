import ElementDrawable from "components/element-draw";
import PlayerHeader from "components/player-header";

const controller = {
  renderElement: (shapes, _pageRef) => {
    return (
      <>
        {shapes?.map((item, index) => {
          return (
            <ElementDrawable
              parentRef={_pageRef}
              width={item.width}
              height={item.height}
              shape={item.type}
              key={index}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: "<p>" + item.content + "</p>",
                }}
              ></div>
            </ElementDrawable>
          );
        })}
      </>
    );
  },
  renderTimer: ({
    hours,
    minutes,
    seconds,
    milliseconds,
    total,
    completed,
  }) => {
    return (
      <PlayerHeader
        timer={{
          minutes,
          seconds,
          milliseconds,
          total,
          initial: 1 * 60 * 1000,
        }}
      />
    );
  },
};

export default controller;
