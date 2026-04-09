function openTab(tabId, button) {
    const sections = document.querySelectorAll('.tab-section');
    const buttons = document.querySelectorAll('.tab-button');

    sections.forEach(section => section.classList.remove('active'));
    buttons.forEach(button => button.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');

    button.classList.add('active');
}