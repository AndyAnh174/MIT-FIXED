import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { CodeBlock } from "./codeblock";
import { Box, styled } from "@mui/material";

const Container = styled(Box)`
  transition: background-color 0.2s ease;
  padding: 18px;
  padding-bottom: 0;
  flex: 1;
  height: fit-content;
`;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const DragDropCode = ({
  disabled,
  codeBlocks,
  onChange,
  result,
}) => {
  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }

    const newOrder = reorder(
      codeBlocks,
      result.source.index,
      result.destination.index,
    );
    onChange?.(newOrder);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" isDropDisabled={disabled}>
        {provided => (
          <Container
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {codeBlocks.map((codeBlock, index) => (
              <CodeBlock
                key={codeBlock.id}
                id={codeBlock.id}
                content={codeBlock.content}
                index={index}
                disabled={disabled}
                result={result && Number(result[index]) === 1}
              />
            ))}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
};
