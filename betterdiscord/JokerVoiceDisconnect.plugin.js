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
      this.iconUrl = "data:image/png;base64,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";
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

        if (!appsItem || !nativeDisconnect || items.some((item) => item.id === this.domItemId)) continue;

        const item = this.createDomDisconnectItem(nativeDisconnect, appsItem);
        nativeDisconnect.parentElement?.insertBefore(item, nativeDisconnect);
        appsItem.style.display = "none";
      }
    }

    createDomDisconnectItem(nativeDisconnect, appsItem) {
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
        this.runAppsDisconnect(appsItem);
      }, true);

      return item;
    }

    async runAppsDisconnect(appsItem) {
      this.dispatchPointer(appsItem, "pointerenter");
      this.dispatchPointer(appsItem, "mouseover");
      this.dispatchPointer(appsItem, "mouseenter");
      await this.wait(120);

      const jokerItem = this.findVisibleDomItem("Joker");
      if (!jokerItem) {
        BdApi.UI.showToast("Commande Joker introuvable dans Apps.", { type: "error" });
        return;
      }

      this.dispatchPointer(jokerItem, "pointerenter");
      this.dispatchPointer(jokerItem, "mouseover");
      this.dispatchPointer(jokerItem, "mouseenter");
      await this.wait(120);

      const disconnectItem = this.findVisibleDomItem("Disconnect", (item) => item.id !== this.domItemId);
      if (!disconnectItem) {
        BdApi.UI.showToast("Commande Disconnect introuvable dans Joker.", { type: "error" });
        return;
      }

      this.dispatchPointer(disconnectItem, "pointerdown");
      this.dispatchPointer(disconnectItem, "mousedown");
      this.dispatchPointer(disconnectItem, "pointerup");
      this.dispatchPointer(disconnectItem, "mouseup");
      disconnectItem.click();
    }

    findVisibleDomItem(text, predicate = () => true) {
      return Array.from(document.querySelectorAll('[role="menuitem"]'))
        .find((item) => this.getDomText(item) === text && predicate(item) && item.offsetParent !== null);
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

    wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
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
        label === "dÃ©connecter" ||
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

