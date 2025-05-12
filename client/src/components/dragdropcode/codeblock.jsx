import { Box, styled } from "@mui/material";
import classNames from "classnames";
import { Draggable } from "react-beautiful-dnd";

const Container = styled(Box)`
  position: relative;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 18px;
  background-color: white;
  font-size: 24px;
  user-select: none;
  background: #f2c94c33;
  transition: background 0.2s linear;

  &:after {
    content: attr(data-index);
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
    background: #dd2e44;
    color: white;
    padding: 10px;
    border-radius: 10px;
    transition: background 0.2s linear;
  }

  &.dragging {
    background: #f2c94c80;
  }

  &.disabled {
    background: #bcbcbc4d;

    &:after {
      background: #7f7f7f;
    }
  }

  &.right {
    background: #1aca9b4d;

    &:after {
      background: #0088b2;
    }
  }

  &.wrong {
    background: #ff71834d;

    &:after {
      background: #0088b2;
    }
  }
`;

export const CodeBlock = ({
  id,
  index,
  content,
  disabled,
  result,
}) => {
  return (
    <Draggable
      draggableId={`${id}`}
      index={index}
      isDragDisabled={disabled}
    >
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          data-index={id}
          className={classNames({
            dragging: snapshot.isDragging,
            right: result === true,
            wrong: result === false,
            disabled,
          })}
        >
          <pre style={{ tabSize: "30px" }}>{content}</pre>
        </Container>
      )}
    </Draggable>
  );
};
