document.addEventListener('DOMContentLoaded', function () {
    const checkElement = setInterval(() => {
        const commandDialog = document.querySelector(".quick-input-widget");
        if (commandDialog) {
            // Apply the blur effect immediately if the command dialog is visible
            if (commandDialog.style.display !== "none") {
                runMyScript();
            }
            // Create a DOM observer to 'listen' for changes in element's attribute.
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        if (commandDialog.style.display === 'none') {
                            handleEscape();
                        } else {
                            // If the .quick-input-widget element (command palette) is in the DOM
                            // but no inline style display: none, show the backdrop blur.
                            runMyScript();
                        }
                    }
                });
            });

            observer.observe(commandDialog, { attributes: true });

            // Clear the interval once the observer is set
            clearInterval(checkElement);
        } else {
            console.log("Command dialog not found yet. Retrying...");
        }
    }, 500); // Check every 500ms

    // Execute when command palette was launched.
    document.addEventListener('keydown', function (event) {
        if ((event.metaKey || event.ctrlKey) && event.key === 'p') {
            event.preventDefault();
            runMyScript();
        } else if (event.key === 'Escape' || event.key === 'Esc') {
            event.preventDefault();
            handleEscape();
        }
    });

    // Ensure the escape key event listener is at the document level
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' || event.key === 'Esc') {
            handleEscape();
        }
    }, true);

    function runMyScript() {
        const targetDiv = document.querySelector(".monaco-workbench");

        // Remove existing element if it already exists
        const existingElement = document.getElementById("command-blur");
        if (existingElement) {
            existingElement.remove();
        }

        // Create and configure the new element
        const newElement = document.createElement("div");
        newElement.setAttribute('id', 'command-blur');

        newElement.addEventListener('click', function () {
            newElement.remove();
        });

        // Append the new element as a child of the targetDiv
        targetDiv.appendChild(newElement);

        // Apply custom comment styles
        applyCustomCommentStyles();
    }

    // Remove the backdrop blur from the DOM when esc key is pressed.
    function handleEscape() {
        const element = document.getElementById("command-blur");
        if (element) {
            element.click();
        }
    }

    // Function to apply custom styles to comments starting with // ! //\u00A0
    function applyCustomCommentStyles() {
        const alphabets = 'abcdefghijklmnopqrstuvwxyz';
        // Get all the token elements in the editor
        const tokens = document.querySelectorAll('.mtk3');

        tokens.forEach(token => {
            let textContent = token.textContent;
            const index = [...textContent].findIndex(char => alphabets.includes(char.toLowerCase()));
            textContent = textContent.slice(0, index).replaceAll(/\s/g, '') // removing space from comment text

            // Check if the comment starts with // !
            if (textContent.startsWith('//!') || textContent.startsWith('!')) {
                token.classList.add('comment-red');
            } else if (textContent.startsWith('///') || textContent.startsWith('>')) {
                token.classList.add('comment-orange');
            } else if (textContent.startsWith('//?') || textContent.startsWith('?')) {
                token.classList.add('comment-blue');
            } else if (textContent.startsWith('//|') || textContent.startsWith('|')) {
                token.classList.add('comment-yellow');
            }
        });
    }

    // Observe changes in the editor to reapply styles when content changes
    const editorObserver = new MutationObserver(() => {
        applyCustomCommentStyles();
    });

    // Start observing the editor for changes
    editorObserver.observe(document.body, { childList: true, subtree: true });

    // Initial application of custom styles
    applyCustomCommentStyles();
});
