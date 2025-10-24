import { FileType } from "../models";

// Default seeds data
export const fileTypesSeed = {
    name: "FileTypes",
    async run() {
        await FileType.bulkCreate(
            [
                // 3D форматы для печати
                { extension: "stl", description: "STL - Stereolithography" },
                { extension: "obj", description: "OBJ - Wavefront Object" },
                { extension: "3mf", description: "3MF - 3D Manufacturing Format" },
                { extension: "amf", description: "AMF - Additive Manufacturing File Format" },
                {
                    extension: "step",
                    description: "STEP - Standard for the Exchange of Product Data",
                },
                {
                    extension: "iges",
                    description: "IGES - Initial Graphics Exchange Specification",
                },

                // CAD программы
                { extension: "sldprt", description: "SolidWorks Part File" },
                { extension: "sldasm", description: "SolidWorks Assembly File" },
                { extension: "ipt", description: "Autodesk Inventor Part" },
                { extension: "iam", description: "Autodesk Inventor Assembly" },
                { extension: "prt", description: "Siemens NX Part" },
                { extension: "catpart", description: "CATIA Part" },
                { extension: "catproduct", description: "CATIA Product" },
                { extension: "fcstd", description: "FreeCAD Document" },
                { extension: "3d", description: "KOMPAS-3D Document" },
                { extension: "m3d", description: "KOMPAS-3D Model" },
                { extension: "a3d", description: "KOMPAS-3D Assembly" },

                // Дизайнерские программы
                { extension: "blend", description: "Blender Project" },
                { extension: "max", description: "3ds Max Scene" },
                { extension: "mb", description: "Maya Binary" },
                { extension: "ma", description: "Maya ASCII" },
                { extension: "ztl", description: "ZBrush Tool" },
                { extension: "skp", description: "SketchUp Document" },

                // Дополнительные форматы
                { extension: "fbx", description: "Filmbox" },
                { extension: "dae", description: "COLLADA" },
                { extension: "ply", description: "Polygon File Format" },
            ],
            { ignoreDuplicates: true }
        );
    },
};
