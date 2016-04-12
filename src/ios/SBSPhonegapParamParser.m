//
//  SBSPhonegapParamParser.m
//  Hello World
//
//  Created by Moritz Hartmeier on 02/12/15.
//
//

#import "SBSPhonegapParamParser.h"

#import "SBSLegacyUIParamParser.h"
#import "SBSUIParamParser.h"
#import "SBSConstraints.h"


@implementation SBSPhonegapParamParser

+ (NSString *)paramContinuousMode { return [@"continuousMode" lowercaseString]; }
+ (NSString *)paramPortraitMargins { return [@"portraitMargins" lowercaseString]; }
+ (NSString *)paramLandscapeMargins { return [@"landscapeMargins" lowercaseString]; }
+ (NSString *)paramPortraitConstraints { return [@"portraitConstraints" lowercaseString]; }
+ (NSString *)paramLandscapeConstraints { return [@"landscapeConstraints" lowercaseString]; }
+ (NSString *)paramAnimationDuration { return [@"animationDuration" lowercaseString]; }

+ (NSString *)paramLeftMargin { return [@"leftMargin" lowercaseString]; }
+ (NSString *)paramTopMargin { return [@"topMargin" lowercaseString]; }
+ (NSString *)paramRightMargin { return [@"rightMargin" lowercaseString]; }
+ (NSString *)paramBottomMargin { return [@"bottomMargin" lowercaseString]; }
+ (NSString *)paramWidth { return [@"width" lowercaseString]; }
+ (NSString *)paramHeight { return [@"height" lowercaseString]; }

+ (NSString *)paramPaused { return [@"paused" lowercaseString]; }

+ (NSString *)paramOrientations { return [@"orientations" lowercaseString]; }
+ (NSString *)paramOrientationsPortrait { return [@"portrait" lowercaseString]; }
+ (NSString *)paramOrientationsPortraitUpsideDown { return [@"portraitUpsideDown" lowercaseString]; }
+ (NSString *)paramOrientationsLandscapeLeft { return [@"landscapeLeft" lowercaseString]; }
+ (NSString *)paramOrientationsLandscapeRight { return [@"landscapeRight" lowercaseString]; }

+ (NSString *)paramSearchBar { return [@"searchBar" lowercaseString]; }
+ (NSString *)paramSearchBarActionButtonCaption { return [@"searchBarActionButtonCaption" lowercaseString]; }
+ (NSString *)paramSearchBarCancelButtonCaption { return [@"searchBarCancelButtonCaption" lowercaseString]; }
+ (NSString *)paramSearchBarPlaceholderText { return [@"searchBarPlaceholderText" lowercaseString]; }
+ (NSString *)paramMinSearchBarBarcodeLength { return [@"minSearchBarBarcodeLength" lowercaseString]; }
+ (NSString *)paramMaxSearchBarBarcodeLength { return [@"maxSearchBarBarcodeLength" lowercaseString]; }


+ (void)updatePicker:(ScanditSDKRotatingBarcodePicker *)picker
         fromOptions:(NSDictionary *)options
  withSearchDelegate:(id<ScanditSDKSearchBarDelegate>)searchDelegate {
    
    NSObject *orientationsObj = [options objectForKey:[self paramOrientations]];
    if (orientationsObj) {
        NSUInteger allowed = 0;
        if ([orientationsObj isKindOfClass:[NSString class]]) {
            NSString *orientationsString = (NSString *)orientationsObj;
            if ([orientationsString rangeOfString:[self paramOrientationsPortrait]].location != NSNotFound) {
                allowed = allowed | (1 << UIInterfaceOrientationPortrait);
            }
            if ([orientationsString rangeOfString:[self paramOrientationsPortraitUpsideDown]].location != NSNotFound) {
                allowed = allowed | (1 << UIInterfaceOrientationPortraitUpsideDown);
            }
            if ([orientationsString rangeOfString:[self paramOrientationsLandscapeLeft]].location != NSNotFound) {
                allowed = allowed | (1 << UIInterfaceOrientationLandscapeLeft);
            }
            if ([orientationsString rangeOfString:[self paramOrientationsLandscapeRight]].location != NSNotFound) {
                allowed = allowed | (1 << UIInterfaceOrientationLandscapeRight);
            }
          
        } else if ([orientationsObj isKindOfClass:[NSArray class]]) {
            NSArray *orientationsArray = (NSArray *)orientationsObj;
            for (NSObject *obj in orientationsArray) {
                if ([obj isKindOfClass:[NSString class]]) {
                    NSString *orientationsString = (NSString *)obj;
                    if ([orientationsString isEqualToString:[self paramOrientationsPortrait]]) {
                        allowed = allowed | (1 << UIInterfaceOrientationPortrait);
                    } else if ([orientationsString isEqualToString:[self paramOrientationsPortraitUpsideDown]]) {
                        allowed = allowed | (1 << UIInterfaceOrientationPortraitUpsideDown);
                    } else if ([orientationsString isEqualToString:[self paramOrientationsLandscapeLeft]]) {
                        allowed = allowed | (1 << UIInterfaceOrientationLandscapeLeft);
                    } else if ([orientationsString isEqualToString:[self paramOrientationsLandscapeRight]]) {
                        allowed = allowed | (1 << UIInterfaceOrientationLandscapeRight);
                    }
                }
            }
        } else {
            NSLog(@"SBS Plugin: failed to parse allowed orientations - wrong type");
        }
        picker.allowedInterfaceOrientations = allowed;
    }
    
    NSObject *searchBar = [options objectForKey:[self paramSearchBar]];
    if (searchBar) {
        if ([searchBar isKindOfClass:[NSNumber class]]) {
            [picker showSearchBar:[((NSNumber *)searchBar) boolValue]];
            picker.searchDelegate = searchDelegate;
        } else {
            NSLog(@"SBS Plugin: failed to parse search bar - wrong type");
        }
    }
    
    NSObject *searchBarActionCaption = [options objectForKey:[self paramSearchBarActionButtonCaption]];
    if (searchBarActionCaption) {
        if ([searchBarActionCaption isKindOfClass:[NSString class]]) {
            picker.manualSearchBar.goButtonCaption = (NSString *) searchBarActionCaption;
        } else {
            NSLog(@"SBS Plugin: failed to parse search bar action button caption - wrong type");
        }
    }
    
    NSObject *searchBarCancelCaption = [options objectForKey:[self paramSearchBarCancelButtonCaption]];
    if (searchBarCancelCaption) {
        if ([searchBarCancelCaption isKindOfClass:[NSString class]]) {
            picker.manualSearchBar.cancelButtonCaption = (NSString *) searchBarCancelCaption;
        } else {
            NSLog(@"SBS Plugin: failed to parse search bar cancel button caption - wrong type");
        }
    }
    
    NSObject *searchBarPlaceholder = [options objectForKey:[self paramSearchBarPlaceholderText]];
    if (searchBarPlaceholder) {
        if ([searchBarPlaceholder isKindOfClass:[NSString class]]) {
            picker.manualSearchBar.placeholder = (NSString *) searchBarPlaceholder;
        } else {
            NSLog(@"SBS Plugin: failed to parse search bar placeholder text - wrong type");
        }
    }
    
    NSObject *minLength = [options objectForKey:[self paramMinSearchBarBarcodeLength]];
    if (minLength) {
        if ([minLength isKindOfClass:[NSNumber class]]) {
            picker.manualSearchBar.minTextLengthForSearch = [((NSNumber *) minLength) integerValue];
        } else {
            NSLog(@"SBS Plugin: failed to parse search bar min length - wrong type");
        }
    }
    
    NSObject *maxLength = [options objectForKey:[self paramMaxSearchBarBarcodeLength]];
    if (maxLength) {
        if ([maxLength isKindOfClass:[NSNumber class]]) {
            picker.manualSearchBar.maxTextLengthForSearch = [((NSNumber *) maxLength) integerValue];
        } else {
            NSLog(@"SBS Plugin: failed to parse search bar max length - wrong type");
        }
    }
}

+ (void)updateLayoutOfPicker:(ScanditSDKRotatingBarcodePicker *)picker
                 withOptions:(NSDictionary *)options {
    
    CGFloat animationDuration = 0;
    NSObject *animation = [options objectForKey:[self paramAnimationDuration]];
    if (animation) {
        if ([animation isKindOfClass:[NSNumber class]]) {
            animationDuration = [((NSNumber *)animation) floatValue];
        } else {
            NSLog(@"SBS Plugin: failed to parse animation duration - wrong type");
        }
    }
    
    NSObject *portraitMargins = [options objectForKey:[self paramPortraitMargins]];
    NSObject *landscapeMargins = [options objectForKey:[self paramLandscapeMargins]];
    NSObject *portraitConstraints = [options objectForKey:[self paramPortraitConstraints]];
    NSObject *landscapeConstraints = [options objectForKey:[self paramLandscapeConstraints]];
    
    if (portraitMargins || landscapeMargins) {
        picker.portraitConstraints = [[SBSConstraints alloc]
                                      initWithMargins:[SBSPhonegapParamParser
                                                       extractMarginsRectFromObject:portraitMargins]];
        picker.landscapeConstraints = [[SBSConstraints alloc]
                                       initWithMargins:[SBSPhonegapParamParser
                                                        extractMarginsRectFromObject:landscapeMargins]];
        
        [picker adjustSize:animationDuration];
        
    } else if (portraitConstraints || landscapeConstraints) {
        picker.portraitConstraints = [[SBSConstraints alloc] init];
        picker.landscapeConstraints = [[SBSConstraints alloc] init];
        
        picker.portraitConstraints = [SBSPhonegapParamParser
                                      extractConstraintsFromObject:portraitConstraints];
        
        picker.landscapeConstraints = [SBSPhonegapParamParser
                                       extractConstraintsFromObject:landscapeConstraints];
        
        [picker adjustSize:animationDuration];
    }
}

+ (CGRect)extractMarginsRectFromObject:(NSObject *)margins {
    if (!margins) return CGRectZero;
    
    CGRect screenRect = [[UIScreen mainScreen] bounds];
    CGFloat screenWidth = screenRect.size.width;
    CGFloat screenHeight = screenRect.size.height;
    
    if ([margins isKindOfClass:[NSString class]]) {
        return [SBSLegacyUIParamParser rectFromParameter:margins];
    } else if ([margins isKindOfClass:[NSArray class]]) {
        NSArray *marginsArray = (NSArray *) margins;
        if ([marginsArray count] == 4 && ([SBSUIParamParser array:marginsArray onlyContainObjectsOfClass:[NSNumber class]]
                                          || [SBSUIParamParser array:marginsArray onlyContainObjectsOfClass:[NSString class]])) {
            
            return CGRectMake([SBSUIParamParser getSize:marginsArray[0] relativeTo:screenWidth],
                              [SBSUIParamParser getSize:marginsArray[1] relativeTo:screenHeight],
                              [SBSUIParamParser getSize:marginsArray[2] relativeTo:screenWidth],
                              [SBSUIParamParser getSize:marginsArray[3] relativeTo:screenHeight]);
        }
    } else {
        NSLog(@"SBS Plugin: failed to parse portrait margins - wrong type");
    }
    return CGRectZero;
}

+ (SBSConstraints *)extractConstraintsFromObject:(NSObject *)constraints {
    if (!constraints) return [[SBSConstraints alloc] init];
    
    CGRect screenRect = [[UIScreen mainScreen] bounds];
    CGFloat screenWidth = screenRect.size.width;
    CGFloat screenHeight = screenRect.size.height;
    
    SBSConstraints *result = [[SBSConstraints alloc] init];
    
    if ([constraints isKindOfClass:[NSDictionary class]]) {
        NSDictionary *constraintsDict = (NSDictionary *)constraints;
        result.leftMargin = [SBSUIParamParser
                             getSizeOrNull:[constraintsDict objectForKey:[SBSPhonegapParamParser paramLeftMargin]]
                             relativeTo:screenWidth];
        result.topMargin = [SBSUIParamParser
                            getSizeOrNull:[constraintsDict objectForKey:[SBSPhonegapParamParser paramTopMargin]]
                            relativeTo:screenHeight];
        result.rightMargin = [SBSUIParamParser
                              getSizeOrNull:[constraintsDict objectForKey:[SBSPhonegapParamParser paramRightMargin]]
                              relativeTo:screenWidth];
        result.bottomMargin = [SBSUIParamParser
                               getSizeOrNull:[constraintsDict objectForKey:[SBSPhonegapParamParser paramBottomMargin]]
                               relativeTo:screenHeight];
        result.width = [SBSUIParamParser
                        getSizeOrNull:[constraintsDict objectForKey:[SBSPhonegapParamParser paramWidth]]
                        relativeTo:screenWidth];
        result.height = [SBSUIParamParser
                         getSizeOrNull:[constraintsDict objectForKey:[SBSPhonegapParamParser paramHeight]]
                         relativeTo:screenHeight];
    } else {
        NSLog(@"SBS Plugin: failed to parse constraints - wrong type");
    }
    return result;
}

+ (BOOL)isPausedSpecifiedInOptions:(NSDictionary *)options {
    NSObject *paused = [options objectForKey:[self paramPaused]];
    if (paused) {
        if ([paused isKindOfClass:[NSNumber class]]) {
            return [((NSNumber *)paused) boolValue];
        } else {
            NSLog(@"SBS Plugin: failed to parse paused - wrong type");
        }
    }
    return NO;
}

@end
