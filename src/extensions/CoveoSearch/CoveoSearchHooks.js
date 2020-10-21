import { useEffect } from "react";
import { each, map } from "lodash";

export const useScripts = (js, scriptsLoadedHandler) => {
  useEffect(() => {
    if (!js || !js.length) return () => {};

    const scripts = map(js, ({ URL, InlineContent }) => {
      const script = document.createElement("script");

      if (URL && URL.length) {
        script.src = URL;
      } else if (InlineContent && InlineContent.length) {
        const inlineScript = document.createTextNode(InlineContent);
        script.appendChild(inlineScript);
      }

      return script;
    });

    each(scripts, script => {
      document.body.appendChild(script);
    });

    scriptsLoadedHandler();

    return () => {
      each(scripts, script => {
        document.body.removeChild(script);
      });
    };
  }, [js, scriptsLoadedHandler]);
};

export const useCss = css => {
  useEffect(() => {
    if (!css || !css.length) return () => {};

    const elements = map(css, ({ URL, InlineContent }) => {
      let element;

      if (URL && URL.length) {
        element = document.createElement("link");
        element.setAttribute("rel", "stylesheet");
        element.type = "text/css";
        element.href = URL;
      } else if (InlineContent && InlineContent.length) {
        element = document.createElement("style");
        element.type = "text/css";
        const inlineStyle = document.createTextNode(InlineContent);
        element.appendChild(inlineStyle);
      }

      return element;
    });

    each(elements, element => {
      document.body.appendChild(element);
    });

    return () => {
      each(elements, element => {
        document.body.removeChild(element);
      });
    };
  }, [css]);
};
