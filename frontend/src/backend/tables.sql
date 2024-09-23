CREATE TABLE Alloys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alloyName TEXT NOT NULL
);

CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(256) NOT NULL
);

-- make a thread table and attach a foreign key to the reference table

CREATE TABLE Reference (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    userId UUID NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Alloid and referenceid should always be unique
CREATE TABLE AlloyReference (
    alloyId UUID NOT NULL,
    referenceId UUID NOT NULL,
    properties TEXT NOT NULL,
    FOREIGN KEY (alloyId) REFERENCES Alloys(id),
    FOREIGN KEY (referenceId) REFERENCES Reference(id)
);
