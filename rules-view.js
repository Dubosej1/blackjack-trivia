import * as rulesCopy from "./rules-copy.js";

export const instructionsModal = {
    mainContainer: document.querySelector(`.instructions-modal__main`),

    generateModalContent () {
        let divArr = [];

        divArr.push(this.generateTableOfContents());
        divArr.push(this.generateGameOverviewDiv());

        divArr.push(this.generateStartingTheGameDiv());
        divArr.push(this.generateDealingTheCardsDiv());

        this.appendChildArrToParent(divArr, this.mainContainer);
    },

    generateTableOfContents () {
        let linksArr = [];

        let parentDiv = document.createElement(`div`);

        let heading = document.createElement(`h2`);
        heading.innerHTML = `Table of Contents`;

        linksArr.push(this.createLinkElement(`Game Overview`, `#instructions-modal__game-overview`));
        linksArr.push(this.createLinkElement(`Starting The Game`, `#instructions-modal__starting-the-game`));
        linksArr.push(this.createLinkElement(`Dealing The Cards`, `#instructions-modal__dealing-the-cards`));

        let parentDivWithLinks = this.appendChildArrToParent(linksArr, parentDiv);

        return parentDivWithLinks;
    },

    appendChildArrToParent (childElemArr, parentElem) {

        childElemArr.forEach(function (link) {
            parentElem.appendChild(link);
        });

        return parentElem;
    },

    createLinkElement (content, hrefStr) {
        const link = document.createElement(`a`);
        const linkContent = document.createTextNode(content);

        link.appendChild(linkContent);
        link.href = hrefStr;

        link.classList.add(`instructions-modal__table-content-link`);

        return link;
    },

    createSectionElement (headingContent) {
        let parentDiv = document.createElement(`div`);

        let headingElem = document.createElement(`h2`);

        headingElem.innerHTML = headingContent;

        parentDiv.appendChild(headingElem);

        return parentDiv;
    },

    createContentBlock (content) {
        let blockDiv = document.createElement(`div`);
        blockDiv.innerHTML = content;

        return blockDiv;
    },

    generateGameOverviewDiv () {
        let parentDiv = this.createSectionElement(`Game Overview`);

        let contentDiv = this.createContentBlock(rulesCopy.gameOverviewContent);

        parentDiv.appendChild(contentDiv);

        parentDiv.id = `#instructions-modal__game-overview`;

        return parentDiv;
    },

    generateStartingTheGameDiv () {
        let parentDiv = this.createSectionElement(`Starting The Game`);

        let beginningText = this.createContentBlock(rulesCopy.stgBeginningStatement);

        parentDiv.appendChild(beginningText);

        parentDiv.id = `instructions-modal__starting-the-game`;

        return parentDiv;
    },


    generateDealingTheCardsDiv () {
        let contentArr = [];
        let parentDiv = this.createSectionElement(`Dealing The Cards`);

        contentArr.push(this.createContentBlock(rulesCopy.dealCardsBeginningStatement));
        contentArr.push(this.createContentBlock(rulesCopy.dealCardsPlayerFields));

        parentDiv.id = `instructions-modal__dealing-the-cards`;

        let appendedParentDiv = this.appendChildArrToParent(contentArr, parentDiv);

        return appendedParentDiv;
    }
}