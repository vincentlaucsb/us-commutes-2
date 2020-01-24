import React, { ReactElement } from "react";

export interface TabProps {
    children: Array<ReactElement>;
}

export default function Tabs(props: TabProps) {
    if (Array.isArray(props.children)) {
        let keys = (props.children).map((node) => {
            if (node.key) {
                return node.key;
            }

            throw new Error("Key for immediate child of Tabs cannot be null");
        });

        let [activeKey, setKey] = React.useState(keys[0]);

        const activeIndex = keys.indexOf(activeKey);

        return <div className="tabs-container">
            <div className="tabs" role="group">
                {keys.map((key) => {
                    const onClick = () => { setKey(key); }
                    const className = (key === activeKey) ? "tabs-button tabs-button-active" : "tabs-button";

                    return (
                        <button
                            className={className}
                            key={key}
                            onClick={onClick}
                        >{key}</button>
                    );
                })}
            </div>

            <div className="tabs-children">
                {props.children[activeIndex]}
            </div>
        </div>
    }

    throw new Error("Tabs has no children");
}