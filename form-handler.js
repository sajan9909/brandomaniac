document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("myForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = {
            extraText: document.getElementById("extraText").value,
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            number: document.getElementById("number").value.trim(),
            message: document.getElementById("message").value.trim()
        };

        console.log("Submitting data:", formData); // Debugging

        try {
            const response = await fetch("http://localhost:5000/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            console.log("Server Response:", result);
            alert(result.message);

            if (result.success) {
                document.getElementById("myForm").reset();
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to submit form.");
        }
    });
});
