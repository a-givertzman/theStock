// -------------------------------------------------------
// КОНСТАНТЫ | Константы диалогового окна
//
const btn = {
    Ok	            : 0x00000400, 	// An "OK" button defined with the AcceptRole.
    Open	        : 0x00002000, 	// A "Open" button defined with the AcceptRole.
    Save	        : 0x00000800, 	// A "Save" button defined with the AcceptRole.
    Cancel	        : 0x00400000, 	// A "Cancel" button defined with the RejectRole.
    Close	        : 0x00200000, 	// A "Close" button defined with the RejectRole.
    Discard	        : 0x00800000, 	// A "Discard" or "Don't Save" button, depending on the platform, defined with the DestructiveRole.
    Apply	        : 0x02000000, 	// An "Apply" button defined with the ApplyRole.
    Reset	        : 0x04000000, 	// A "Reset" button defined with the ResetRole.
    RestoreDefaults	: 0x08000000, 	// A "Restore Defaults" button defined with the ResetRole.
    Help	        : 0x01000000, 	// A "Help" button defined with the HelpRole.
    SaveAll	        : 0x00001000, 	// A "Save All" button defined with the AcceptRole.
    Yes	            : 0x00004000, 	// A "Yes" button defined with the YesRole.
    YesToAll	    : 0x00008000, 	// A "Yes to All" button defined with the YesRole.
    No	            : 0x00010000, 	// A "No" button defined with the NoRole.
    NoToAll	        : 0x00020000, 	// A "No to All" button defined with the NoRole.
    Abort	        : 0x00040000, 	// An "Abort" button defined with the RejectRole.
    Retry	        : 0x00080000, 	// A "Retry" button defined with the AcceptRole.
    Ignore	        : 0x00100000, 	// An "Ignore" button defined with the AcceptRole.
    NoButton	    : 0x00000000, 	// An invalid button.
};



// -------------------------------------------------------
// Функция | Показывает модальный диалог с кнопками
//
function messageBox(mess) {
    console.group('messageBox {');
    
    let dialogBoxModal = document.querySelector('#dialogModal');
    if (dialogBoxModal) {

        let btnOkModal = dialogBoxModal.querySelector('#btnOkModal')[0];
        let btnCancelModal = dialogBoxModal.querySelector('#btnCancelModal')[0];
    }
    
    var reply;
    if (confirm(mess)) {
        reply = btn.Yes;
    } else {
        reply = btn.No;
    }

    if (dialogBoxModal && btnOkModal && btnCancelModal) {

        btnOkModal.onclick = function() {
            console.group('messageBox.btnOkModal { ');
            
            // modalDialog.close();
            dialogBoxModal.style.display = 'none';
            
            console.groupEnd();
            return btn.Yes;
        }
        
        btnCancelModal.onclick = function() {
            console.group('messageBox.modalCancel { ');
            
            // modalDialog.close();
            dialogBoxModal.style.display = 'none';
            
            console.groupEnd();
            return btn.No;
        }
    }
        
    // modalDialog.showModal();
    // modalDialog.style.display = 'block';

    console.groupEnd();
    return reply;
}