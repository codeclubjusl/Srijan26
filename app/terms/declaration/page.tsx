const PDF_URL = "/pdf/declaration.pdf"; 
const DeclarationPage = () => (
    <div style={{ width: "100%", height: "100vh" }}>
        <iframe
            src={PDF_URL}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title="Declaration PDF"
        />
    </div>
);

export default DeclarationPage;