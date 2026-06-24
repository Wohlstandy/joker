/**
 * @name JokerVoiceDisconnect
 * @author Wohlstand
 * @version 1.0.0
 * @description Moves Joker's disconnect app command out of Apps and places it directly above Disconnect.
 */

module.exports = (() => {
  return class JokerVoiceDisconnect {
    constructor() {
      this.itemId = "joker-disconnect-voice";
      this.styleId = "joker-disconnect-icon-style";
      this.iconUrl = "https://cdn.discordapp.com/avatars/1516180523167256718/23c3040b86236db64487cd5b07b95689.png?size=64";
      this.cachedCommand = null;
      this.domItemId = "joker-disconnect-voice-dom";
    }

    getName() { return "JokerVoiceDisconnect"; }
    getAuthor() { return "Wohlstand"; }
    getVersion() { return "1.0.0"; }
    getDescription() { return "Moves Joker's disconnect app command directly above Disconnect in the user context menu."; }

    start() {
      this.injectStyle();
      this.patchUserContextMenus();
      this.startDomFallback();
    }

    stop() {
      for (const cancelPatch of this.cancelPatches || []) cancelPatch();
      this.cancelPatches = [];
      this.domObserver?.disconnect();
      this.domObserver = null;
      document.getElementById(this.domItemId)?.remove();
      document.getElementById(this.styleId)?.remove();
    }

    injectStyle() {
      document.getElementById(this.styleId)?.remove();

      const style = document.createElement("style");
      style.id = this.styleId;
      style.textContent = `
        #${this.itemId} {
          position: relative !important;
          padding-left: 36px !important;
        }

        #${this.domItemId} {
          position: relative !important;
          padding-left: 42px !important;
          color: var(--status-danger, #f23f42) !important;
        }

        #${this.domItemId} .joker-disconnect-dom-icon {
          position: absolute !important;
          left: 12px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          width: 18px !important;
          height: 18px !important;
          border-radius: 50% !important;
          object-fit: cover !important;
          pointer-events: none !important;
          display: block !important;
        }

        #${this.itemId}::before,
        #${this.domItemId}::before {
          content: "" !important;
          position: absolute !important;
          left: 12px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          width: 18px !important;
          height: 18px !important;
          border-radius: 50% !important;
          background: url("${this.iconUrl}") center / cover no-repeat !important;
          pointer-events: none !important;
        }
      `;

      document.head.append(style);
    }

    startDomFallback() {
      this.domObserver = new MutationObserver(() => this.patchDomMenus());
      this.domObserver.observe(document.body, { childList: true, subtree: true });
      this.patchDomMenus();
    }

    patchDomMenus() {
      for (const menu of document.querySelectorAll('[role="menu"]')) {
        const items = this.getDomMenuItems(menu);
        const appsItem = items.find((item) => this.getDomText(item) === "Apps");
        const nativeDisconnect = items.find((item) => this.getDomText(item) === "Disconnect");

        if (!nativeDisconnect || items.some((item) => item.id === this.domItemId)) continue;

        const item = this.createDomDisconnectItem(nativeDisconnect);
        nativeDisconnect.parentElement?.insertBefore(item, nativeDisconnect);
        if (appsItem) appsItem.style.display = "none";
      }
    }

    createDomDisconnectItem(nativeDisconnect) {
      const item = nativeDisconnect.cloneNode(true);
      item.id = this.domItemId;
      item.removeAttribute("aria-checked");
      item.style.display = "";
      item.querySelector(".joker-disconnect-dom-icon")?.remove();

      const icon = document.createElement("img");
      icon.className = "joker-disconnect-dom-icon";
      icon.alt = "";
      icon.src = this.iconUrl;
      item.prepend(icon);

      item.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.clickNativeDisconnect(nativeDisconnect);
      }, true);

      return item;
    }

    clickNativeDisconnect(nativeDisconnect) {
      this.dispatchPointer(nativeDisconnect, "pointerdown");
      this.dispatchPointer(nativeDisconnect, "mousedown");
      this.dispatchPointer(nativeDisconnect, "pointerup");
      this.dispatchPointer(nativeDisconnect, "mouseup");
      nativeDisconnect.click();
    }

    getDomMenuItems(menu) {
      return Array.from(menu.querySelectorAll('[role="menuitem"]'))
        .filter((item) => item.closest('[role="menu"]') === menu);
    }

    getDomText(element) {
      return (element?.innerText || element?.textContent || "").trim();
    }

    dispatchPointer(element, type) {
      const event = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        view: window
      });

      element.dispatchEvent(event);
    }

    patchUserContextMenus() {
      if (!BdApi.ContextMenu?.patch) {
        BdApi.UI.showToast("JokerVoiceDisconnect: user menu introuvable.", { type: "error" });
        return;
      }

      this.cancelPatches = [
        BdApi.ContextMenu.patch("user-context", (returnValue) => this.moveAppsEntry(returnValue)),
        BdApi.ContextMenu.patch("guild-user-context", (returnValue) => this.moveAppsEntry(returnValue)),
        BdApi.ContextMenu.patch("guild-channel-user-menu", (returnValue) => this.moveAppsEntry(returnValue)),
        BdApi.ContextMenu.patch("user", (returnValue) => this.moveAppsEntry(returnValue)),
        BdApi.ContextMenu.patch("*", (returnValue) => this.moveAppsEntry(returnValue))
      ];
    }

    moveAppsEntry(tree) {
      const rootChildren = this.getChildren(tree);
      if (!Array.isArray(rootChildren)) return;

      const nativeDisconnect = this.findDirectItem(rootChildren, (props) => this.isNativeDisconnectItem(props));
      if (!nativeDisconnect || this.findDirectItem(rootChildren, (props) => props.id === this.itemId)) return;

      const command = this.findJokerCommand(rootChildren);
      if (!command) return;

      const commandItem = command.item;
      if (command.parent && command.index > -1) command.parent.splice(command.index, 1);

      this.prepareMovedCommand(commandItem);
      this.insertAboveDisconnect(nativeDisconnect, commandItem);
      this.removeEmptyApps(rootChildren);
    }

    findJokerCommand(rootChildren) {
      const directCommand = this.findItem(rootChildren, (props) => this.isJokerDisconnectCommand(props), true);
      if (directCommand) return directCommand;

      const apps = this.findItem(rootChildren, (props) => this.isAppsItem(props), false);
      const appsChildren = this.getChildren(apps?.item, true);
      const command = this.findItem(appsChildren, (props) => this.isJokerDisconnectCommand(props), true);

      if (command) {
        this.cachedCommand = command.item;
        return command;
      }

      if (this.cachedCommand) return { parent: null, index: -1, item: this.cloneElement(this.cachedCommand) };
      return null;
    }

    prepareMovedCommand(item) {
      if (!item?.props) return;

      item.props.id = this.itemId;
      item.props.label = "Disconnect";
      item.props.color = "danger";
      item.props.danger = true;
    }

    insertAboveDisconnect(nativeDisconnect, item) {
      const disconnectIndex = nativeDisconnect.parent.indexOf(nativeDisconnect.item);
      if (disconnectIndex > -1) nativeDisconnect.parent.splice(disconnectIndex, 0, item);
    }

    removeEmptyApps(rootChildren) {
      const apps = this.findItem(rootChildren, (props) => this.isAppsItem(props), false);
      if (!apps) return;

      const children = this.getChildren(apps.item, true);
      if (!children || !children.filter(Boolean).length) apps.parent.splice(apps.index, 1);
    }

    findDirectItem(children, predicate) {
      if (!Array.isArray(children)) return null;

      for (let index = 0; index < children.length; index++) {
        const item = children[index];
        if (item?.props && predicate(item.props)) return { parent: children, index, item };
      }

      return null;
    }

    findItem(children, predicate, includeFunctionChildren) {
      if (!Array.isArray(children)) return null;

      for (let index = 0; index < children.length; index++) {
        const item = children[index];
        const props = item?.props;

        if (props && predicate(props)) return { parent: children, index, item };

        const nested = this.getChildren(item, includeFunctionChildren);
        const found = this.findItem(nested, predicate, includeFunctionChildren);
        if (found) return found;
      }

      return null;
    }

    getChildren(node, includeFunctionChildren = false) {
      const children = node?.props?.children;

      if (typeof children === "function") {
        if (!includeFunctionChildren) return null;

        try {
          const result = children();
          return Array.isArray(result) ? result : result ? [result] : null;
        } catch {
          return null;
        }
      }

      return Array.isArray(children) ? children : children ? [children] : null;
    }

    cloneElement(element) {
      if (!element?.props || !BdApi.React?.cloneElement) return element;
      return BdApi.React.cloneElement(element, { ...element.props });
    }

    isAppsItem(props) {
      const label = this.getItemText(props);
      const id = String(props?.id || "").toLowerCase();

      return id === "user-apps" || id === "apps" || id.includes("apps") || label === "Apps";
    }

    isNativeDisconnectItem(props) {
      const id = String(props?.id || "").toLowerCase();

      return props?.id !== this.itemId &&
        (id === "disconnect" ||
          id === "user-disconnect" ||
          id === "voice-disconnect");
    }

    isJokerDisconnectCommand(props) {
      if (!props || this.isNativeDisconnectItem(props) || this.isAppsItem(props)) return false;

      const label = this.getItemText(props).trim().toLowerCase();
      const id = String(props.id || "").toLowerCase();

      return label === "disconnect" ||
        label === "deconnecter" ||
        label === "dÃƒÆ’Ã‚Â©connecter" ||
        id.includes("disconnect");
    }

    getItemText(props) {
      return this.getText(props?.label) || this.getText(props?.children);
    }

    getText(value) {
      if (typeof value === "string") return value;
      if (Array.isArray(value)) return value.map((child) => this.getText(child)).join("");
      return value?.props ? this.getText(value.props.children) : "";
    }
  };
})();

