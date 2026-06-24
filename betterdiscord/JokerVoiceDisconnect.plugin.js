/**
 * @name JokerVoiceDisconnect
 * @author Wohlstand
 * @version 1.0.0
 * @description Moves Joker's disconnect app command out of Apps and places it directly above Disconnect.
 */

module.exports = (() => {
  return class JokerVoiceDisconnect {
    getName() { return "JokerVoiceDisconnect"; }
    getAuthor() { return "Wohlstand"; }
    getVersion() { return "1.0.0"; }
    getDescription() { return "Moves Joker's disconnect app command directly above Disconnect in the user context menu."; }

    start() {
      this.patchUserContextMenu();
    }

    stop() {
      if (this.cancelPatch) this.cancelPatch();
      this.cancelPatch = null;
    }

    patchUserContextMenu() {
      if (!BdApi.ContextMenu?.patch) {
        BdApi.UI.showToast("JokerVoiceDisconnect: user menu introuvable.", { type: "error" });
        return;
      }

      this.cancelPatch = BdApi.ContextMenu.patch("user-context", (returnValue) => {
        this.moveAppsEntry(returnValue);
      });
    }

    moveAppsEntry(tree) {
      const rootChildren = this.getChildren(tree);
      if (!Array.isArray(rootChildren)) return;

      const nativeDisconnect = this.findItem(rootChildren, (props) => this.isNativeDisconnectItem(props));
      const command = this.findItem(rootChildren, (props) => this.isJokerDisconnectCommand(props));
      const apps = this.findItem(rootChildren, (props) => this.isAppsItem(props));

      if (!nativeDisconnect || !command) return;

      const [commandItem] = command.parent.splice(command.index, 1);
      this.copyDisconnectStyle(commandItem, nativeDisconnect.item);
      this.renameItem(commandItem, "Disconnect");
      this.insertAboveDisconnect(nativeDisconnect, commandItem);
      this.removeEmptyApps(rootChildren);

      if (apps && !this.getChildren(apps.item)?.filter(Boolean).length) {
        this.removeEmptyApps(rootChildren);
      }
    }

    insertAboveDisconnect(nativeDisconnect, item) {
      const disconnectIndex = nativeDisconnect.parent.indexOf(nativeDisconnect.item);

      if (disconnectIndex > -1) nativeDisconnect.parent.splice(disconnectIndex, 0, item);
    }

    copyDisconnectStyle(item, disconnectItem) {
      if (!item?.props || !disconnectItem?.props) return;

      item.props.color = disconnectItem.props.color || "danger";
      item.props.danger = true;
    }

    renameItem(item, label) {
      if (!item?.props) return;

      item.props.label = label;
    }

    removeEmptyApps(rootChildren) {
      const apps = this.findItem(rootChildren, (props) => this.isAppsItem(props));
      if (!apps) return;

      const children = this.getChildren(apps.item);
      if (!children || !children.filter(Boolean).length) apps.parent.splice(apps.index, 1);
    }

    findItem(children, predicate) {
      if (!Array.isArray(children)) return null;

      for (let index = 0; index < children.length; index++) {
        const item = children[index];
        const props = item?.props;

        if (props && predicate(props)) return { parent: children, index, item };

        const nested = this.getChildren(item);
        const found = this.findItem(nested, predicate);
        if (found) return found;
      }

      return null;
    }

    getChildren(node) {
      const children = node?.props?.children;
      if (typeof children === "function") return null;
      return Array.isArray(children) ? children : children ? [children] : null;
    }

    isAppsItem(props) {
      const label = this.getItemText(props);
      return props.id === "user-apps" || props.id === "apps" || label === "Apps";
    }

    isNativeDisconnectItem(props) {
      const id = String(props.id || "").toLowerCase();

      return id === "disconnect" ||
        id === "user-disconnect" ||
        id.includes("disconnect");
    }

    isJokerDisconnectCommand(props) {
      const label = this.getItemText(props);

      return label === "Disconnect" && !this.isNativeDisconnectItem(props);
    }

    getItemText(props) {
      return this.getText(props.label) || this.getText(props.children);
    }

    getText(value) {
      if (typeof value === "string") return value;
      if (Array.isArray(value)) return value.map((child) => this.getText(child)).join("");
      return value?.props ? this.getText(value.props.children) : "";
    }
  };
})();
