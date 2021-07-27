import { createSlice } from '@reduxjs/toolkit';
import { v4 } from 'uuid';
import { CheckboxItem, ComputedItem, ComputeRule, InputItem, Item, ItemTag } from '../Types';

/**
 * Application overview
 *  A description of the purpose of your application
 *  Links & Urls
 *    - Environments
 *    - Git repos
 *    - Pipeline job url
 *    - multiple inputs
 * Used technology
 *  Repository dependencies
 *    - multiple inputs
 * Dev testing env requirements
 *  Resource estimations
 *    - multiple inputs
 * Service dependencies (optional)
 *  Application services that your app depends on (internal & external)
 *    - multiple inputs
 * 
 * Build from source
 *  Source code versioning
 *    Git link
 *  All deps are fetched via a dependency manager
 *    Link to composer.json
 *  Lock file generated
 *    Link to composer.lock
 *  Dep manager does not rely on external dependencies
 *  Fixed major and minor versios
 *  Only create files with group permissions
 *  Do not save config in db
 *  Only realease managers have access to config repos
 *  No prod values are used
 *  Applications do not use dev entry point (app_dev.php in Symfony)
 *  
 * Error tracking
 *  All errors and warnings are tracked
 *  Apps do not have debug messages in error logs
 *  Applications are sent to a centralized logging system
 * 
 * Build quality
 *  At least 60% code coverage
 *    Link to sonar
 *  Functional/acceptance tests
 *    - link to functional tests repo
 *    - link to pipeline that runs the tests
 *  Smoke tests
 *    - link to smoke tests file in smoke-generator
 *    - link to stack with green smoke tests icon
 *  Performance tests
 *    - link to tests
 *    - link to pipeline
 *  0 bugs
 *    - link to sonar
 * 
 * Decoupling
 *  The app does not share state storage with other apps
 *  Apps do not share dbs
 *  Apps do not share RabbitMq
 *  Apps are able to validate / re-create queues
 *  Data migrations are used
 *  Applications in non-prod envs do not require expensive resources
 * 
 * Deploy
 *  Continuous integrations pipeline
 *    Unit tests 
 *      - link to repo
 *    Sonar analysis
 *      - link to sonar
 *    Static analysis
 *      - link to sonar EE
 *  Continuous delivery
 *    Automatic deployment on dev/test env (emag-test stack?)
 *    Functional acceptance tests
 *      - link to tests
 *      - link to pipeline
 *  
 *      
 *  
 */


function traverseAndApply(item: Item, apply: (a: Item) => Item): Item {
  if (item.tag === ItemTag.Computed) {
    return apply(
      {
        ...item,
        children: item.children.map((child) => {
          return traverseAndApply(child, apply);
        })
      }
    );
  } else {
    return apply({ ...item });
  }
}

let makeEmptyItem = (): Item => {
  return {
    uuid: v4(),
    content: "# hello",
    tag: ItemTag.Computed,
    rule: ComputeRule.All,
    children: []
  };
};

export enum Mode {
  Standby,
  Cut,
  Copy
}

type ModeState = {
  tag: Mode,
  item: Item | null;
};

export type FormState = {
  mode: ModeState;
  tree: Item;
};



let initialState: FormState = {
  mode: { tag: Mode.Standby, item: null },
  tree: {
    uuid: v4(),
    content: "# hello",
    tag: ItemTag.Computed,
    rule: ComputeRule.All,
    children: [
      {
        uuid: v4(),
        tag: ItemTag.Checkbox,
        content: "# bonjour",
        checked: false,
      },
      {
        uuid: v4(),
        tag: ItemTag.Input,
        content: "# salut",
        checked: true,
        input: "some text",
      }
    ]
  }
};

let updateItemInTree = (tree: Item, toUpdate: Item) => {
  return traverseAndApply(tree, (item) => {

    if (item.uuid === toUpdate.uuid) {
      return { ...toUpdate };
    }

    return { ...item };
  });
};

let addItemToTreeOnTarget = (tree: Item, toAdd: Item, target: Item) => {
  return traverseAndApply(tree, (item) => {
    switch (item.tag) {
      case ItemTag.Computed:
        return {
          ...item,
          children: item.children.flatMap(
            (c) => {
              if (c.uuid === target.uuid) {
                return [c, toAdd];
              }

              return [c];
            })
        };
      default:
        return { ...item };
    }

  });
};

let removeItemInTree = (tree: Item, toRemove: Item) => {
  return traverseAndApply(tree, (item) => {
    switch (item.tag) {
      case ItemTag.Computed:
        return { ...item, children: item.children.filter((c) => c.uuid !== toRemove.uuid) };
      default:
        return { ...item };
    }
  });
};


let updateItemTag = (tree: Item, itemToChange: Item, tag: ItemTag): Item => {
  return traverseAndApply(tree, (item: Item) => {
    if (itemToChange.uuid !== item.uuid) {
      return item;
    }

    switch (item.tag) {
      case (ItemTag.Computed):
        switch (tag) {
          case ItemTag.Checkbox:
            return ((): CheckboxItem => {
              return {
                uuid: item.uuid,
                tag: ItemTag.Checkbox,
                content: item.content,
                checked: false,
              };
            })();
          case ItemTag.Input:
            return ((): InputItem => {
              return {
                uuid: item.uuid,
                tag: ItemTag.Input,
                content: item.content,
                checked: false,
                input: "",
              };
            })();

          case ItemTag.Computed:
            return ((): ComputedItem => {
              return {
                uuid: item.uuid,
                tag: ItemTag.Computed,
                content: item.content,
                children: item.children,
                rule: ComputeRule.All
              };
            })();

        }
        break;
      default:
        switch (tag) {
          case ItemTag.Checkbox:
            return ((): CheckboxItem => {
              return {
                uuid: item.uuid,
                tag: ItemTag.Checkbox,
                content: item.content,
                checked: false,
              };
            })();
          case ItemTag.Input:
            return ((): InputItem => {
              return {
                uuid: item.uuid,
                tag: ItemTag.Input,
                content: item.content,
                checked: false,
                input: "",
              };
            })();

          case ItemTag.Computed:
            return ((): ComputedItem => {
              return {
                uuid: item.uuid,
                tag: ItemTag.Computed,
                content: item.content,
                children: [],
                rule: ComputeRule.All
              };
            })();
        }
    }
  });
};

export const formSlice = createSlice({
  name: 'form',
  initialState: initialState,
  reducers: {
    updateItem: (state, action) => {
      state.tree = updateItemInTree(state.tree, action.payload);
    },
    changeItemTag: (state, action) => {
      let item = action.payload.item;
      let tag = action.payload.tag;

      state.tree = updateItemTag(state.tree, item, tag);
    },
    addChild: (state, action: { payload: ComputedItem; }) => {
      let item = action.payload;

      item = { ...item, children: [...item.children, makeEmptyItem()] };
      state.tree = updateItemInTree(state.tree, item);
    },
    cutItem: (state, action: { payload: Item; }) => {
      let item = action.payload;

      state.tree = removeItemInTree(state.tree, item);
      state.mode = { tag: Mode.Cut, item: item };
    },
    pasteOnTarget: (state, action: { payload: Item; }) => {
      let target = action.payload;
      let toAdd = state.mode.item;

      if (toAdd !== null) {
        state.tree = addItemToTreeOnTarget(state.tree, toAdd, target);
        state.mode = { tag: Mode.Standby, item: null };
      } else {
        console.warn("Attempting to paste without cutting or copying first.");
      }
    }
  },
});

// Action creators are generated for each case reducer function 
export const { updateItem, addChild, cutItem, pasteOnTarget, changeItemTag } = formSlice.actions;

export default formSlice.reducer;