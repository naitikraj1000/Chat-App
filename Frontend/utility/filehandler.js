function Filehandler(callback) {
  const input = document.createElement('input');
  input.type = 'file';

  // Listen for change event to handle selected files
  input.addEventListener('change', (event) => {
    // Access the selected files from the event
    const selectedFiles = event.target.files;
    // Call the callback function with the selected files
    callback(selectedFiles);
  });

  // Trigger click event to prompt file selection dialog
  input.click();
}

export default Filehandler;
