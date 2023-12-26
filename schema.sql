-- Drop the table if it exists (optional, use it only during development or reset)
DROP TABLE IF EXISTS recipes;

-- Create the 'recipes' table
CREATE TABLE recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    image TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL
);

-- Add constraints (optional but can enforce data integrity)
-- Example: Limiting title length to 100 characters
ALTER TABLE recipes
    ADD CONSTRAINT title_length CHECK (LENGTH(title) <= 100);

-- Insert default data if needed (as part of initial setup)
INSERT INTO recipes (title, image, ingredients, instructions)
VALUES ('Default Recipe', 'default_image_url.jpg', 'Default ingredients', 'Default instructions');