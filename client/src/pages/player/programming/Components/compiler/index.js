import React from "react";
import PropTypes from "prop-types";
import Editor from "@monaco-editor/react";

Compiler.propTypes = {};

function Compiler(props) {
  const {handleEditorOnChange, handleEditorDidMount} = props;
  
  return (
    <div className="compiler-space">
      <div className="left">
        <div className="code">
          <Editor
            height="100%"
            width="100%"
            defaultLanguage="cpp"
            onChange={handleEditorOnChange}
            onMount={handleEditorDidMount}
            loading={<p>loading</p>}
            className="editor"
            options={{ fontSize: "18px" }}
          />
        </div>
      </div>
      <div className="right">
        <div className="card input-card">
          <div className="title">Input</div>
          <div className="text-space">
            <textarea
              className="input"
              value={state.input}
              onChange={handleInputOnChange}
            />
          </div>
        </div>
        <div className="controllers">
          <button className="btn-clear btn-3D">CLEAR</button>
          <button
            className="btn-debug btn-3D"
            onClick={handleDebugClick}
          >
            DEBUG
          </button>
          <button className="btn-run btn-3D" onClick={handleRunClick}>
            RUN
          </button>
        </div>
        <div className="card output-card">
          <div className="title">Output</div>
          <div className="text-space">
            <textarea
              className="input"
              disabled={true}
              value={state.result}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Compiler;
